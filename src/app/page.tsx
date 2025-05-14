"use client";

import { useEffect, useState } from "react";
const emoji = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "-"];

export default function Home() {
  const [answer, setAnswer] = useState<Array<number>>([]);
  const [isFinish, setIsFinish] = useState({ is: false, complete: false });
  const [select, setSelect] = useState({ row: 0, col: 0 });
  const [blocks, setBlocks] = useState([
    [6, 6, 6, 6],
    [6, 6, 6, 6],
    [6, 6, 6, 6],
    [6, 6, 6, 6],
    [6, 6, 6, 6],
    [6, 6, 6, 6],
    [6, 6, 6, 6],
    [6, 6, 6, 6],
  ]);
  const [result, setResult] = useState<Array<{ hit: number; blow: number }>>(
    []
  );
  const [check, setCheck] = useState(false);
  const initializingGame = () => {
    setSelect({ row: 0, col: 0 });
    setIsFinish({ is: false, complete: false });
    setBlocks([
      [6, 6, 6, 6],
      [6, 6, 6, 6],
      [6, 6, 6, 6],
      [6, 6, 6, 6],
      [6, 6, 6, 6],
      [6, 6, 6, 6],
      [6, 6, 6, 6],
      [6, 6, 6, 6],
    ]);
    setResult([]);
    let _ans = [1, 1, 1, 1];
    if (check) {
      _ans = [0, 1, 2, 3, 4, 5]
        .toSorted(() => Math.random() - Math.random())
        .slice(0, 4);
    } else {
      _ans = [...Array(4)].map(() => {
        return Math.floor(Math.random() * 6);
      });
    }
    setAnswer(_ans);
  };
  useEffect(() => {
    initializingGame();
  }, [, check]);
  const emojiSelect = (_emoji_key: number, next = true) => {
    const _rows = blocks[select.row].map((block, i) => {
      if (i == select.col) {
        return _emoji_key;
      } else {
        return block;
      }
    });
    const _blocks = blocks.map((block, i) => {
      if (i == select.row) {
        return _rows;
      } else {
        return block;
      }
    });
    setBlocks(_blocks);
    if (next && select.col < 3) {
      setSelect({ ...select, col: select.col + 1 });
    }
  };
  const checkBlock = () => {
    if (blocks[select.row].includes(6)) {
      return false;
    }
    let hit = 0;
    let blow = 0;
    const currentRow = blocks[select.row];
    const answerCount = Array(6).fill(0);
    const guessCount = Array(6).fill(0);
    // まずHit
    for (let i = 0; i < 4; i++) {
      if (currentRow[i] === answer[i]) {
        hit++;
      } else {
        answerCount[answer[i]]++;
        guessCount[currentRow[i]]++;
      }
    }
    // Blowを計算
    for (let i = 0; i < 6; i++) {
      blow += Math.min(answerCount[i], guessCount[i]);
    }
    if (hit == 4) {
      setIsFinish({ is: true, complete: true });
      return false;
    }
    setResult([...result, { hit: hit, blow: blow }]);
    setSelect((_prev) => {
      return { row: _prev.row + 1, col: 0 };
    });
    if (select.row > 7) {
      setIsFinish({ is: true, complete: false });
    }
  };
  //key
  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case " ":
      case "space":
        checkBlock();
        break;
      case "1":
        emojiSelect(0);
        break;
      case "2":
        emojiSelect(1);
        break;
      case "3":
        emojiSelect(2);
        break;
      case "4":
        emojiSelect(3);
        break;
      case "5":
        emojiSelect(4);
        break;
      case "6":
        emojiSelect(5);
        break;
      case "backspace":
        emojiSelect(6, false);
        if (0 < select.col) {
          setSelect({ ...select, col: select.col - 1 });
          break;
        }
        break;
      case "arrowleft":
        if (0 < select.col) {
          setSelect({ ...select, col: select.col - 1 });
          break;
        }
        break;
      case "arrowright":
        if (select.col < 3) {
          setSelect({ ...select, col: select.col + 1 });
          break;
        }
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
  return (
    <>
      <div className={`place-content-center flex`}>
        <div className="p-4 max-w-md ">
          <h1 className="text-center text-2xl">Hit and blow</h1>
          <div className="flex items-center gap-x-2">
            <input
              id="checkbox"
              type="checkbox"
              checked={check}
              onChange={(e) => {
                setCheck(e.target.checked);
              }}
            />
            <label htmlFor="checkbox">
              答えの色が被らないようにする（簡単）
            </label>
          </div>
          {isFinish.is ? (
            <div>
              {isFinish.complete ? (
                <>
                  <p className="text-center my-4 text-xl">🎉　正解　🎉</p>
                  <div className="grid grid-cols-6 items-center gap-x-8 p-4 border-1 rounded">
                    <span>解</span>
                    {answer.map((col, key_col) => {
                      return (
                        <span
                          key={key_col}
                          onClick={() => {
                            setSelect({ ...select, col: key_col });
                          }}
                        >
                          {emoji[col]}
                        </span>
                      );
                    })}
                    <span>4H/0B</span>
                  </div>
                  <button
                    className="my-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      initializingGame();
                    }}
                  >
                    リセット
                  </button>
                </>
              ) : (
                <>
                  <p className="text-center my-4 text-xl">
                    ８ターン以内に終わりませんでした
                  </p>
                  <div className="grid grid-cols-6 items-center gap-x-8 p-4 border-1 rounded">
                    <span>解</span>
                    {answer.map((col, key_col) => {
                      return (
                        <span
                          key={key_col}
                          onClick={() => {
                            setSelect({ ...select, col: key_col });
                          }}
                        >
                          {emoji[col]}
                        </span>
                      );
                    })}
                    <span>4H/0B</span>
                  </div>
                  <button
                    className="my-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      initializingGame();
                    }}
                  >
                    リセット
                  </button>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="my-4 flex place-content-center">
                <div className=" grid grid-row-8 gap-y-4">
                  {blocks.map((block, key_row) => {
                    return (
                      <div key={key_row}>
                        <div className="grid grid-cols-6 items-center gap-x-8">
                          <span>{key_row + 1}</span>
                          {block.map((col, key_col) => {
                            return (
                              <span
                                key={key_col}
                                onClick={() => {
                                  setSelect({ ...select, col: key_col });
                                }}
                                className={
                                  select.row == key_row && select.col == key_col
                                    ? `text-center border-1 rounded p-1 cursor-default`
                                    : `text-center border-0 p-1 cursor-default`
                                }
                              >
                                {emoji[col]}
                              </span>
                            );
                          })}
                          {result[key_row] && (
                            <span>
                              {result[key_row].hit}H/{result[key_row].blow}B
                            </span>
                          )}
                        </div>
                        {/* {key_row < 7 && <hr />} */}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="my-4 flex place-content-center">
                <div className="flex items-center gap-x-4 shadow-sm p-4 rounded-full w-fit">
                  <button
                    onClick={() => {
                      if (0 < select.col) {
                        setSelect({ ...select, col: select.col - 1 });
                      }
                    }}
                  >
                    ⬅️
                  </button>
                  <button
                    onClick={() => {
                      if (select.col < 3) {
                        setSelect({ ...select, col: select.col + 1 });
                      }
                    }}
                  >
                    ➡️
                  </button>
                  <span>|</span>
                  {emoji.map((_emoji, _emoji_key) => {
                    if (_emoji_key < 6) {
                      return (
                        <button
                          key={_emoji_key}
                          onClick={() => {
                            emojiSelect(_emoji_key);
                          }}
                        >
                          {_emoji}
                        </button>
                      );
                    }
                  })}
                  <span>|</span>
                  <button
                    className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      checkBlock();
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
              <div className="flex place-content-center gap-x-4">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setIsFinish({ is: true, complete: false });
                  }}
                >
                  ギブアップ
                </button>
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    initializingGame();
                  }}
                >
                  リセット
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
