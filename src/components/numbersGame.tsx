import { useState } from "react";

type Panels = {
  num: string;
  pressed: boolean;
};

let startTime: null | number = null;

const NumbersGame = () => {
  const configLevels = [
    { value: "EASY", side: 4, selected: false },
    { value: "NOMAL", side: 5, selected: true },
    { value: "HARD", side: 6, selected: false },
  ];

  // 初期パネル
  const initialPanels = () => {
    let panels: Panels[] = [];
    for (let i = 0; i < 25; i++) {
      panels = [...panels, { num: "", pressed: true }];
    }
    return panels;
  };
  // レベル
  const [levels, setLevels] = useState(configLevels);

  // パネル
  const [panels, setPanels] = useState<Panels[]>(initialPanels());

  // 現在の数字
  const [currentNum, setCurrentNum] = useState(0);

  // 経過時間
  const [elapsedTime, setElapsedTime] = useState("0.0");

  // スタート時間
  //   const [startTime, setStartTime] = useState<number | null>(null);

  // width
  const [containerWidth, setContainerWidth] = useState(270);

  // タイムアウトID
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);

  // タイマー処理
  const runTimer = () => {
    setElapsedTime(((Date.now() - startTime!) / 1000).toFixed(2));

    setTimeoutId(
      window.setTimeout(() => {
        runTimer();
      }, 10)
    );
  };

  // STARTボタンを押した時の処理
  const startGame = () => {
    setCurrentNum(0);
    const nums: number[] = [];
    for (let i = 0; i < panels.length; i++) {
      nums.push(i);
    }

    const newPanels = [...panels];
    newPanels.forEach((panel) => {
      const randomNum = nums.splice(Math.floor(Math.random() * nums.length), 1);
      panel.num = String(randomNum);
      panel.pressed = false;
    });

    setPanels(newPanels);

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    startTime = Date.now();
    runTimer();
  };

  // パネルを押した時の処理
  const touchPanel = (num: string) => {
    const updatedPanels = [...panels];
    updatedPanels.forEach((panel) => {
      if (num === String(currentNum) && num === panel.num) {
        panel.pressed = true;
        setCurrentNum((prev) => prev + 1);
        return panel;
      }
    });

    setPanels(updatedPanels);

    if (currentNum === panels.length - 1) {
      clearInterval(timeoutId);
    }
  };

  // 難易度選択
  const selectLevel = (value: string) => {
    setCurrentNum(0);
    setElapsedTime("0.0");
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    const updatedLevels = [...levels];
    updatedLevels.forEach((level) => {
      level.selected = false;
    });

    switch (value) {
      case "EASY":
        updatedLevels[0].selected = true;
        setLevels(updatedLevels);
        setContainerWidth(50 * updatedLevels[0].side + 20);
        break;
      case "NOMAL":
        updatedLevels[1].selected = true;
        setLevels(updatedLevels);
        setContainerWidth(50 * updatedLevels[1].side + 20);
        break;
      case "HARD":
        updatedLevels[2].selected = true;
        setLevels(updatedLevels);
        setContainerWidth(50 * updatedLevels[2].side + 20);
        break;
    }

    let panels: Panels[] = [];
    const side = levels.filter((level) => {
      return level.selected === true;
    });

    for (let i = 0; i < side[0].side ** 2; i++) {
      panels = [...panels, { num: "", pressed: true }];
    }
    setPanels(panels);
  };

  return (
    <div className="w-80 mx-auto">
      <main className={`w-[${containerWidth}px] mx-auto my-4`}>
        <ul className="flex justify-between text-xl w-full px-[10px] mb-2">
          {levels.map((level) => {
            return (
              <li
                key={level.value}
                className={`cursor-pointer ${
                  level.selected ? "text-black" : ""
                }`}
                onClick={() => selectLevel(level.value)}
              >
                {level.value}
              </li>
            );
          })}
        </ul>
        <div className="mb-2 text-xl text-right">{elapsedTime}</div>
        <ul className="p-[10px] bg-white rounded mb-2 flex flex-wrap">
          {panels.map((panel, index) => {
            return (
              <li
                key={index}
                className={`w-10 h-10 cursor-pointer leading-10 text-center rounded m-[5px] ${
                  panel.pressed
                    ? "bg-gray-300 shadow-none mt-[9px] mb-[1px]"
                    : "bg-[#00aaff] shadow-[0_4px_0_#0088cc]"
                }`}
                onClick={() => touchPanel(panel.num)}
              >
                {panel.num}
              </li>
            );
          })}
        </ul>
        <button
          className="w-full mx-auto select-none bg-[#f44336] p-2 rounded shadow-[0_4px_0_#d1483e] active:mt-1 active:shadow-none"
          onClick={startGame}
        >
          START
        </button>
      </main>
    </div>
  );
};
export default NumbersGame;
