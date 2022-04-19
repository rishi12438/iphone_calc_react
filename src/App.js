import React, { useState } from "react";

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const btnValues = [
  ["AC", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) =>
  String(num).replace(/(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
  });
  const numClickHandler = (e) => {
    e.preventDefault();
    
    const value = e.target.innerHTML;
    if(calc.num === "Err" || calc.res === "Err"){ 
      return 
    }
    var current_num = calc.num >=1000000000  ?  Number(calc.num).toPrecision() : calc.num
    var finalNumAns = "0"
    
    if(removeSpaces(current_num) % 1 === 0){ 
      if(Number(removeSpaces(current_num+ value)) < 1000000000){ 
        finalNumAns = toLocaleString(Number(removeSpaces(current_num + value)))
      }
      else{ 
        finalNumAns = toLocaleString(Number(removeSpaces(current_num + value)).toExponential())
      }
    } else{ 
      if(current_num+ value  < 1000000000){ 
        finalNumAns = toLocaleString(current_num+ value)
      }
      else{ 
        finalNumAns = toLocaleString((current_num + value).toExponential())
      }
    }

    setCalc({
      ...calc,
      num:finalNumAns,
      res: !calc.sign ? 0 : calc.res,
    });

  };
  
  const pointClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHandler = (e) => {
    if(calc.res === "Err"){ 
      return 
    }

    var result = calc.res; 
    var finalSecondNum = calc.num
    
    //if sign already exists
    if (calc.sign !== "") {
      finalSecondNum = removeSpaces(finalSecondNum)
      var sign = calc.sign
      if(calc.sign === "X"){ 
        sign = "*"
      } 
      try{ 
        result = eval(removeSpaces(calc.res).toString()+ sign+ finalSecondNum.toString())
      } catch(err){ 
        result = "Infinity"
      }

      //checking if division by 0 s
      if(result == "Infinity"){ 
        result = "Err"
        finalSecondNum = "Err"
      } else{ 
        result = Number(result)
        result = result  >= 1000000000 ? result.toExponential() : result
        result = toLocaleString(result)
        finalSecondNum = 0 
      }
    }
    else{
      //else just invert the values from result and finalSecondNum  
      if(Number(finalSecondNum) !== 0  ){ 
        result = toLocaleString(finalSecondNum)
      }     
      finalSecondNum = 0 
    }

    //change state
    setCalc({
      ...calc,
      sign: e.target.innerHTML,
      res: result,
      num: finalSecondNum,
    });
  };

  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
        sign === "+"
          ? a + b >= 1000000000 ? (a+b).toExponential() : a+b 
          : sign === "-"
          ? a -b >= 1000000000 ? (a-b).toExponential() : a-b 
          : sign === "X"
          ? a * b >= 1000000000 ? (a*b).toExponential() : a*b
          : a /b >= 1000000000 ? (a/b).toExponential() : a/b

      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "/"
            ? "Err"
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.res)),
                  Number(removeSpaces(calc.num)),
                  calc.sign
                )
              ),
        sign: "",
        num: 0,
      });
    }
  };

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };

  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "=" ? "equals" : btn === "+" || btn === "-" || btn === "/" || btn === "X" ? "arthimetic":""}
              value={btn}
              onClick={
                btn === "AC"
                  ? resetClickHandler
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "."
                  ? pointClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};

export default App;
