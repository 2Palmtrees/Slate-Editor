import type { S3Client } from '@aws-sdk/client-s3';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import type { FileStorage, ListOptions, ListResult } from '@mjackson/file-storage';
import { LazyFile, type LazyContent } from '@mjackson/lazy-file';

/**
 * An S3 implementation of the `FileStorage` interface.
 */
export class S3FileStorage implements FileStorage {
  #s3: S3Client;
  #bucketName: string;

  constructor(s3: S3Client, bucketName: string) {
    this.#s3 = s3;
    this.#bucketName = bucketName;
  }
  //https://github.com/mjackson/remix-the-web/blob/main/packages/file-storage/CHANGELOG.md#file-storage-changelog
  list<T extends ListOptions>(options?: T): ListResult<T> | Promise<ListResult<T>> {
    throw new Error("Method not implemented.");
  }
  //https://github.com/mjackson/remix-the-web/blob/main/packages/file-storage/CHANGELOG.md#v050-2025-01-25
  put(key: string, file: File): File | Promise<File> {
    throw new Error("Method not implemented.");
  }

  async has(key: string): Promise<boolean> {
    try {
      await this.#s3.send(
        new HeadObjectCommand({
          Bucket: this.#bucketName,
          Key: key,
        })
      );
      return true;
    } catch (error) {
      if (error instanceof Error ? error.name === 'NotFound' : '') {
        return false;
      }
      throw error;
    }
  }

  async set(key: string, file: File): Promise<void> {
    const upload = new Upload({
      client: this.#s3,
      params: {
        Bucket: this.#bucketName,
        Key: key,
        Body: file.stream(),
      },
    });
    await upload.done();
  }

  // async put(key: string, file: File): Promise<File> {
  //   await set(key, file);
  //   const file = await this.get(key);
  //   if (!file) {
  //     throw new Error('Failed to fetch file are put');
  //   }
  //   return file;
  // }

  async get(key: string): Promise<File | null> {
    try {
      const head = await this.#s3.send(
        new HeadObjectCommand({
          Bucket: this.#bucketName,
          Key: key,
        })
      );

      const contentLength = Number(head.ContentLength);
      const contentType = head.ContentType || 'application/octet-stream';

      const s3 = this.#s3;
      const bucketName = this.#bucketName;

      const lazyContent: LazyContent = {
        byteLength: contentLength,
        stream: (start: number = 0, end: number = contentLength) => {
          const range = `bytes=${start}-${end - 1}`;
          return new ReadableStream({
            async start(controller) {
              try {
                const command = new GetObjectCommand({
                  Bucket: bucketName,
                  Key: key,
                  Range: range,
                });
                const { Body } = await s3.send(command);

                if (!Body) {
                  throw new Error('Failed to retrieve a valid stream from S3');
                }

                const reader = Body.transformToWebStream().getReader();

                const read = async () => {
                  const { done, value } = await reader.read();
                  if (done) {
                    controller.close();
                  } else {
                    controller.enqueue(value);
                    await read();
                  }
                };

                await read();
              } catch (error) {
                controller.error(error);
              }
            },
          });
        },
      };

      return new LazyFile(lazyContent, key, { type: contentType });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        return null;
      }
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    await this.#s3.send(
      new DeleteObjectCommand({
        Bucket: this.#bucketName,
        Key: key,
      })
    );
  }
}
