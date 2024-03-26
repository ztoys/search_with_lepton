async function pump(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  controller: ReadableStreamDefaultController,
  onChunk?: (chunk: Uint8Array) => void,
  onDone?: () => void,
): Promise<void> {
  reader.read().then(({ done, value }) => {
    if (done) {
      onDone && onDone();
      controller.close();
      return;
    }
    onChunk && onChunk(value);
    controller.enqueue(value);
    pump(reader, controller, onChunk, onDone);
  });
}
export const fetchStream = (
  response: Response,
  onChunk?: (chunk: Uint8Array) => void,
  onDone?: () => void,
): ReadableStream<string> => {
  const reader = response.body!.getReader();
  return new ReadableStream({
    start: (controller) => pump(reader, controller, onChunk, onDone),
  });
};
