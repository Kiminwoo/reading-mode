const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.module\.css$/, // CSS 모듈 파일에 대한 로더 설정
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { // CSS 모듈 사용 설정
                localIdentName: '[name]__[local]__[hash:base64:5]' // 클래스명 생성 규칙
              }
            }
          }
        ]
      },
      {
        test: /\.css$/, // 일반 CSS 파일에 대한 로더 설정
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.' },  // public 폴더의 모든 파일을 dist로 복사
        { from: 'src/content', to: 'content' },  // src/content 폴더의 모든 파일을 dist/content로 복사
        { from: './background.js', to: '.' }  // 루트 디렉토리의 background.js를 dist로 복사
      ]
    })
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000
  }
};