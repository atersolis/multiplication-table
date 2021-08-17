export const MulTable = () => {
  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <table>
      <thead>
        <tr>
          <th className="cell">×</th>
          {range.map((n) => (
            <th key={n} className="cell">
              {n}
            </th>
          ))}
          <th className="cell">×</th>
        </tr>
      </thead>
      <tbody>
        {range.map((i) => (
          <tr key={i}>
            <th className="cell">{i}</th>
            {range.map((j) => (
              <td
                className={"cell" + ((i + j) % 2 === 0 ? " darkCell" : "")}
                key={j}
              >
                {i * j}
                <div className="mul">
                  {i} × {j}
                </div>
              </td>
            ))}
            <th className="cell">{i}</th>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th className="cell">×</th>
          {range.map((n) => (
            <th key={n} className="cell">
              {n}
            </th>
          ))}
          <th className="cell">×</th>
        </tr>
      </tfoot>
    </table>
  );
};
