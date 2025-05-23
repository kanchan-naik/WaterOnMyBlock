useDebouncedCallback
====================

Install
-------
With npm

`npm i use-debounced-callback`

With Yarn

`yarn add use-debounced-callback`

Usage
-----

```javascript
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounced-callback";

const FuncComp = () => {
  const [ text, setText, ] = useState("");
  const debouncedCallback = useDebouncedCallback((e) => {
    setText(e.target.value);
  }, 250);

  return (
    <div>
      <input onChange={debouncedCallback} />
      {text}
    </div>
  );
}
```
