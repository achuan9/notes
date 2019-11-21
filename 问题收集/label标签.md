
- 点击“点击我”可以触发复选框
```html
<label>
  <input type="checkbox">
  <span>点击我</span>
</label>
```
- 点击“点击我”不可以触发复选框，因为设置了`<label for="">`
```html
<label for="">
  <input type="checkbox">
  <span>点击我</span>
</label>
```
- 点击“点击我”不可以触发复选框，因为将`<span>`改为了`<button>`
```html
<label>
  <input type="checkbox">
  <button>点击我</button>
</label>
```

- 也可以通过阻止默认事件来阻止触发复选框
```html
<label>
  <input type="checkbox">
  <span @click.prevent="clickHandler">点击我</span>
</label>
```