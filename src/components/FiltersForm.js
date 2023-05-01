import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const FiltersForm = () => {

  const [skills, setSkills] = useState([]);

  const teamOptions = [
    "Working solo",
    "Looking for teammates",
    "Has a team",
  ]

  const skillsArr = ["CSS"];

  useEffect(() => {
    const skillsQuery = query(collection(db, "skills"), orderBy("skillName"))
    onSnapshot(skillsQuery, (snapshot) => {
      let skillsArray = [];
      setSkills(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    });
  }, []);

  // const handleFilterChange = useCallback(event => {
  //   setState(previousState => {
  //     let filters = new Set(previousState.filters)
  //     let products = PRODUCTS

  //     if (event.target.checked) {
  //       filters.add(event.target.value)
  //     } else {
  //       filters.delete(event.target.value)
  //     }

  //     if (filters.size) {
  //       products = products.filter(product => {
  //         return filters.has(product.category)
  //       })
  //     }

  //     return {
  //       filters,
  //       products,
  //     }
  //   })
  // }, [setState])

  return (
    <div>
      <div className="uppercase">
        filters
      </div>
      <div>
        {skills.map((skill) => (
          <li className="list-none" key={skill.id}>
            <label>
              <input className="mr-2"
                // onChange={handleFilterChange}
                type="checkbox"
                value={skill.data.skillName} />
              {skill.data.skillName}
            </label>
          </li>
        ))}
      </div>
    </div>
  )
}

export default FiltersForm;