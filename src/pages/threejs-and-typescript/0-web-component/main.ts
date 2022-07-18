import "@/components/WordCount";
import "@/components/WordCount2";

const template = `
<h1>Word count rating widget</h1>
<article contenteditable="">
  <h2>Sample heading</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc pulvinar sed justo sed viverra. Aliquam ac scelerisque tellus. Vivamus porttitor nunc vel nibh rutrum hendrerit. Donec viverra vestibulum pretium. Mauris at eros vitae ante pellentesque bibendum. Etiam et blandit purus, nec aliquam libero. Etiam leo felis, pulvinar et diam id, sagittis pulvinar diam. Nunc pellentesque rutrum sapien, sed faucibus urna sodales in. Sed tortor nisl, egestas nec egestas luctus, faucibus vitae purus. Ut elit nunc, pretium eget fermentum id, accumsan et velit. Sed mattis velit diam, a elementum nunc facilisis sit amet.</p>
  <p>Pellentesque ornare tellus sit amet massa tincidunt congue. Morbi cursus, tellus vitae pulvinar dictum, dui turpis faucibus ipsum, nec hendrerit augue nisi et enim. Curabitur felis metus, euismod et augue et, luctus dignissim metus. Mauris placerat tellus id efficitur ornare. Cras enim urna, vestibulum vel molestie vitae, mollis vitae eros. Sed lacinia scelerisque diam, a varius urna iaculis ut. Nam lacinia, velit consequat venenatis pellentesque, leo tortor porttitor est, sit amet accumsan ex lectus eget ipsum. Quisque luctus, ex ac fringilla tincidunt, risus mauris sagittis mauris, at iaculis mauris purus eget neque. Donec viverra in ex sed ullamcorper. In ac nisi vel enim accumsan feugiat et sed augue. Donec nisl metus, sollicitudin eu tempus a, scelerisque sed diam.</p>
  <p is="word-count"></p>
  <p is="word-count2"></p>
</article>`;
const app = document.querySelector<HTMLDivElement>("#app");
app && (app.innerHTML = template);
// 无法在 "--isolatedModules" 下编译“main.ts”，因为它被视为全局脚本文件。请添加导入、导出或空的 "export {}" 语句来使它成为模块。ts(1208)

interface IState {
  name: string;
  age: number;
}

class TestComponent {
  private state;
  private container: HTMLElement;
  constructor(state: IState, id: string) {
    this.state = state;
    this.container = document.querySelector(`#${id}`) as HTMLElement;
    this.update();
  }
  update() {
    (this.container.querySelector(".name") as HTMLElement).textContent = this.state.name;
    (this.container.querySelector(".age") as HTMLElement).textContent = this.state.age + "";
  }
  set name(value: string) {
    this.state.name = value;
    this.update();
  }
  set age(value: number) {
    this.state.age = value;
    this.update();
  }
}

const test = new TestComponent({ name: "小明", age: 15 }, "test");
setInterval(() => {
  test.age = Date.now();
  test.name = "小明" + Math.floor(Math.random() * 10);
}, 1000);
