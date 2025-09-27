window.onload = () => {
  const randomColors = getRandomColors(8);
  const question = document.getElementById("question");

  // 正解となる色をランダムで選ぶ
  const q_color = randomColors[Math.floor(Math.random() * randomColors.length)];

  // 問題表示（色コード）
  const color_p = document.createElement('p');
  color_p.id = 'target-color';
  color_p.innerText = q_color;
  question.append(color_p);

  // 結果表示用要素
  const resultDiv = document.getElementById("result");

  const color_contents = document.getElementById("color-contents");

  // 色ボタンを生成
  for (let i = 0; i < randomColors.length; i++) {
    const color = randomColors[i];
    const elm = document.createElement('button');
    elm.className = "card";
    // 比較用に data 属性に色を保存（確実に #xxxxxx で比較できる）
    elm.dataset.color = color;
    elm.style.backgroundColor = color;
    elm.setAttribute('aria-label', `色 ${color}`);
    color_contents.appendChild(elm);

    const p = document.createElement('p');
    p.innerText = color;
    // 注意: 元の挙動に合わせて文字色を背景と同じにしています（見づらい場合は下の computeTextColor を使って白黒反転する）
    p.style.color = color;
    elm.appendChild(p);

    // クリックイベント
    elm.addEventListener('click', () => {
      handleGuess(color, elm, q_color, color_contents, resultDiv);
    });
  }
}

/**
 * クリック時の判定処理
 */
function handleGuess(clickedColor, buttonElm, targetColor, container, resultEl) {
  if (buttonElm.disabled) return;

  if (clickedColor.toLowerCase() === targetColor.toLowerCase()) {
    // 正解
    resultEl.innerText = '正解！';

    // === ここで全ボタンを白にする ===
    Array.from(container.children).forEach(btn => {
      btn.style.backgroundColor = "#ffffff";             // 背景を白に
      const p = btn.querySelector("p");                  // ボタン内のテキスト
      btn.disabled = true;                               // 全ボタン無効化
    });

    showPlayAgain(resultEl);

  } else {
    // 不正解
    buttonElm.disabled = true;
    buttonElm.classList.add('wrong');
    buttonElm.style.backgroundColor = "#ffffff";         // 不正解ボタンも白に
    const p = buttonElm.querySelector("p");

    const remaining = Array.from(container.children).filter(btn => !btn.disabled).length;
    if (remaining === 0) {
      // 全滅 → ゲームオーバー
      resultEl.innerText = `ゲームオーバー。正解は ${targetColor} でした。`;

      Array.from(container.children).forEach(btn => {
        btn.style.backgroundColor = "#ffffff";
        const p = btn.querySelector("p");
        btn.disabled = true;
      });

      showPlayAgain(resultEl);
    } else {
      resultEl.innerText = `不正解... 残り ${remaining} 個です。`;
    }
  }
}

/**
 * 簡易な「もう一度」ボタンを表示（ここでは page reload）
 */
function showPlayAgain(resultEl) {
  // 既に表示されていれば何もしない
  if (document.getElementById('play-again')) return;
  const btn = document.createElement('button');
  btn.textContent = 'もう一度';
  btn.id = 'play-again';
  btn.addEventListener('click', () => {
    // 簡単にリロードして再スタート
    location.reload();
  });
  resultEl.appendChild(document.createElement('br'));
  resultEl.appendChild(btn);
}

/**
 * 元の getRandomColors（そのまま）
 */
function getRandomColors(n) {
  const colors = new Set();
  while (colors.size < n) {
    const color = Math.floor(Math.random() * 0x1000000);
    const hex = "#" + color.toString(16).padStart(6, "0");
    colors.add(hex);
  }
  return Array.from(colors);
}

/* ---- オプション：文字色の自動反転（見やすさ向上） ----
function computeTextColor(hex) {
  // hex: "#rrggbb"
  const r = parseInt(hex.substr(1,2), 16);
  const g = parseInt(hex.substr(3,2), 16);
  const b = parseInt(hex.substr(5,2), 16);
  // 輝度（人間視覚補正）
  const lum = 0.2126*r + 0.7152*g + 0.0722*b;
  return lum < 128 ? '#ffffff' : '#000000';
}
これを使う場合、ボタン内の p の文字色に computeTextColor(color) を設定すると読みやすくなります。
*/