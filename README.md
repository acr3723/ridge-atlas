# Ridge Atlas · 山径图鉴

一个纯前端徒步路线目录。通过关键词、难度和距离组合筛选，可以查看路线详情并收藏路线。收藏使用 `localStorage`，刷新后仍可查看。

## 运行

在本目录执行以下命令，打开命令输出的本地地址。

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

页面使用原生 HTML、CSS 和 JavaScript，无构建步骤。静态部署保留 `index.html`、`styles.css`、`app.js` 和 `assets/` 的相对位置。

- `app.js` 包含路线样例、筛选、收藏和详情逻辑。
- `index.html` 使用 HTML 模板渲染卡片，详情使用原生 `dialog`。
- `styles.css` 定义布局、地貌配色和响应式断点。
- `assets/alpine-meadow.jpg` 是使用内置 ImageGen 生成的首屏配图。路线和参数均为虚构示例。

<details>
<summary>配图生成提示词</summary>

Use case: photorealistic-natural. Asset type: wide hero photograph for an independent hiking trail guide. One panoramic, high-resolution, realistic outdoor editorial photograph of a winding footpath in green alpine meadows leading towards the rocky Dolomite peaks. Layered clouds and soft early morning sunlight, warm grass, pale blue sky, natural muted colors, crisp stone and vegetation detail. The mountain ridge is strongest on the right half, with darker foreground on the left to support a white headline added later in CSS. Wide 3:2 landscape framing and central area designed to survive a 3:1 banner crop. No people, logos, text, maps, graphics or watermarks.

</details>
