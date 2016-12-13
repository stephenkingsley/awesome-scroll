# awesome-scroll
A simple and fast container to monitor elements as you scroll [https://stephenkingsley.github.io/stress.html](https://stephenkingsley.github.io/stress.html)

## BASIC USAGE

first

```shell
npm install awesome-scroll --save
```

and in your code

```js
import awesomeScroll from "awesome-scroll";

const scrollElement = document.getElementById("scrollElement");
const watcherElement = awesomeScroll.create(scrollElement);

const addClass = () => {
  if (!this.isInViewport) {
    return;
  } else if (this.isFullyInViewport) {
    this.watchItem.style.backgroundColor = '#fcc';
  } else if (this.isAboveViewport) {
    this.watchItem.style.backgroundColor = '#ccf';
  } else if (this.isBelowViewport) {
    this.watchItem.style.backgroundColor = '#ffc';
  }
}

watcherElement.stateChange(addClass);
```

## DEMO

 - [👉 Stress element](https://stephenkingsley.github.io/stress.html)

 - [👉 fixed element](https://stephenkingsley.github.io/fixed.html)

 - [👉 inner scroll](https://stephenkingsley.github.io/divInADiv.html)

👇 localhost demo

```shell
git clone https://github.com/stephenkingsley/awesome-scroll.git

cd awesome-scroll

npm i

npm run dev
```

open [http://localhost:3000](http://localhost:3000)

### there are some example in `/example` folder
