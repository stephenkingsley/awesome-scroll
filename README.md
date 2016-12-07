# awesome-scroll
A simple and fast container to monitor elements as you scroll [https://stephenkingsley.github.io/stress.html](https://stephenkingsley.github.io/stress.html)

inspiration from [`scrollMonitor`](https://github.com/stutrek/scrollMonitor) @stutrek

## BASIC USAGE

```js
import awesomeScroll from "awesome-scroll";

const scrollElement = document.getElementById("scrollElement");
const watcherElement = awesomeScroll.create(scrollElement);

watcherElement.enterViewport(function() {
  console.log('I have entered the viewport');
});
watcherElement.exitViewport(function() {
  console.log('I have left the viewport');
});
```

## DEMO

```shell
git clone https://github.com/stephenkingsley/awesome-scroll.git

cd awesome-scroll

npm i

npm run dev
```

open [http://localhost:3000](http://localhost:3000)

### there are some example in `/example` folder

 - [`Stress element`](https://stephenkingsley.github.io/stress.html)

 - [`fixed element`](https://stephenkingsley.github.io/fixed.html)

 - [`inner scroll`](https://stephenkingsley.github.io/divInADiv.html)
