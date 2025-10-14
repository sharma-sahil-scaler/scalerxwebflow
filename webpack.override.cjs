const path = require('path')

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
}


