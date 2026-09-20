# 代子康个人主页

这是代子康的个人网页简历，内容聚焦机器人运动控制、强化学习、模仿学习与 Sim-to-Real 部署。

项目为无构建步骤的静态页面：

- `index.html`：页面内容与结构
- `style.css`：视觉样式与响应式布局
- `js/global.js`：滚动导航、渐入动画、加载交互与图片取景参数应用
- `images/`：模板原始图片资源目录
- `kvoy_images/`：当前主页使用的个人图片资源
- `avatar-crop.html`：统一图片裁剪工具，直接基于完整原图调整头像、个人照片和四张项目图片

直接在浏览器中打开 `index.html` 即可预览。

建议通过本地服务器使用图片裁剪工具：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/avatar-crop.html`。在页面顶部选择要调整的图片，拖动、缩放后点击“应用当前图片并打开主页”即可在当前浏览器预览。若要让 GitHub Pages 永久生效，请把工具生成的 CSS 参数写入 `style.css` 对应选择器。
