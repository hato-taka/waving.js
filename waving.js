
  class Wave {
    constructor(config) {
      this.unit = config.unit || 100 //波の大きさ
      this.info = config.info || {}; // キャンバス共通の描画情報
      this.info.seconds = config.infoSeconds || 0;
      this.info.time = config.infoTime || 0; //流れるスピード
      this.animationFrame = config.animationFrame || .014; //アニメーションの1フレームの秒数
      this.timeoutSecond = config.timeoutSecond || 35 // 描画処理の速さ
      this.canvas = document.querySelector(config.el) || document.createElement('canvas'); //セレクタ―の選択
      this.colorList = config.colorList || ['#0ff', '#ff0', '#f00', '#00f', '#f0f'] ; // 各キャンバスの色情報
      this.opacity = config.opacity || [0.8, 0.5, 0.3, 0.2, 0.8] ; //透過
      this.zoom = config.zoom || [3, 4, 1.6, 3, 2]; //波の幅 波長の長さ 大きいほど緩やかな波になる
      this.startPosition = config.startPosition || [0, 0, 0, 100, 0]; //波の開始位置の遅れ
      this.lineWidth = config.lineWidth || 1 ; //線の幅
      this.xAxis = config.xAxis || Math.floor (this.canvas.height / 2); //X軸
      this.yAxis = config.yAxis || 0; //Y軸
      this.stroke = config.stroke || true; //波線のみ
      this.fill = config.fill || false; //塗りつぶし

      this.canvas.width = config.canvasWidth || document.documentElement.clientWidth; // Canvasのwidthをウィンドウの幅に合わせる
      this.canvas.height = config.canvasHeight || 200; //底辺からの波の高さ
      this.canvas.contextCache = this.canvas.getContext("2d");

      if (this.canvas.parentNode === null) {
        const body = document.querySelector('body');
        body.appendChild(this.canvas);
      }
      this.update();
    }

    update() {

      this.draw (this.canvas, this.colorList);

      // 共通の描画情報の更新
      this.info.seconds = this.info.seconds + this.animationFrame;
      this.info.time = this.info.seconds * Math.PI;
      // 自身の再起呼び出し
      setTimeout(this.update.bind(this), this.timeoutSecond); //setTimeoutのthisはWindowになる！
    }

    draw(canvas, color) {
      // 対象 this.canvasのコンテキストを取得
      var context = canvas.contextCache;
      // キャンバスの描画をクリア
      context.clearRect(0, 0, canvas.width, canvas.height);
      //波を描画 drawWave this.canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
      for (let i = 0; i < this.colorList.length; i++){
        this.drawWave (canvas, color[i], this.opacity[i], this.zoom[i], this.startPosition[i]);
      }
    }

    drawWave (canvas, color, alpha, zoom, delay) {
      var context = canvas.contextCache;
      context.globalAlpha = alpha;
      context.beginPath(); //パスの開始
      this.drawSine (canvas, this.info.time / 0.5, zoom, delay);
      
      if(this.stroke){
        context.strokeStyle = color; //線の色
        context.lineWidth = this.lineWidth; //線の幅
        context.stroke(); //線
      }
      if(this.fill){
        context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
        context.lineTo(0, canvas.height); //パスをCanvasの左下へ
        context.closePath() //パスを閉じる
        context.fillStyle = color;//塗りの色
        context.fill(); //塗りつぶす
      }
    }

    drawSine (canvas, t, zoom, delay) {
      var xAxis = this.xAxis;
      var yAxis = this.yAxis;
      var context = canvas.contextCache;
      // Set the initial x and y, starting at 0,0 and translating to the origin on
      // the canvas.
      var x = t; //時間を横の位置とする
      var y = Math.sin(x) / zoom;
      context.moveTo(yAxis, this.unit * y + xAxis); //スタート位置にパスを置く
  
      // Loop to draw segments (横幅の分、波を描画)
      for (let i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t + (-yAxis + i) / this.unit / zoom;
        y = Math.sin(x - delay) / 3;
        context.lineTo(i, this.unit * y + xAxis);
      }
    }
  }