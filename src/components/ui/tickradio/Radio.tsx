import React from "react";
import style from "./radio.module.scss";
type Props = {};

const Radio = () => {
  return (
    <section title=".squaredFour">
      <div className={style.squaredFour}>
        <input
          className={style.input}
          type="checkbox"
          value="None"
          id="squaredFour"
          name="check"
          checked
        />
        <label className={style.label} htmlFor="squaredFour"></label>
      </div>
    </section>
  );
};
export default Radio;
