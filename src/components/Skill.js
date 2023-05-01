import { useState } from "react";
import { db } from "../firebaseConfig";


const Skill = ({id, skillName}) => {

  return (
    <div>
      {skillName}
    </div>
  )
}

export default Skill;
