// We are assuming:
// - No object nesting
// - Strings only occur inside the ingredient object
// - Whitespace only occurs inside strings
export default () => {
  const enum State {
    Out,
    InObject,
  }
  let state: State = State.Out;
  let objStart = 0;
  let prevObjEnd = 0;
  let objPart = "";
  return new TransformStream({
    start() {},
    transform(chunk, controller) {
      let processed = "[" + objPart;
      for (const c of chunk) {
        switch (c) {
          case "{":
            state = State.InObject;

            // Mark current start
            objStart = processed.length;
            break;
          case "}":
            state = State.Out;

            // If current doesn't end, it should be previous end
            prevObjEnd = processed.length + 1;
            break;
        }
        processed += c;
      }
      // If we end before the current object end, store the object part for the next chunk
      if (state == State.InObject) {
        objPart = processed.slice(objStart);
        processed = processed.slice(0, prevObjEnd);
      } else {
        objPart = "";
      }
      processed += "]";
      controller.enqueue(processed);
    },
  });
};
