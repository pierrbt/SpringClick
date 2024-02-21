import {Score} from "./types.ts";


function Table({scores} : {scores: Score[]}) {
  return (
    <table>
      <thead>
      <tr>
        <th>Username</th>
        <th>CPS</th>
      </tr>
      </thead>
      <tbody>
      {scores.map((score) => (
        <tr key={score.id}>
          <td>{score.username}</td>
          <td>{score.cps}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default Table
