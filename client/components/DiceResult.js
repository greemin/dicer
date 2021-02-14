import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./DiceResult.css";

function DiceResult(props) {
  const { results, url } = props;
  const propResults = results;
  const [apiResults, setApiResults] = React.useState();
  var intervalId;

  function setupGetResultsInterval() {
    return setInterval(function () {
      axios
        .get(url)
        .then((response) => {
          const data = response.data || [];
          setApiResults(data.reverse());
        })
        .catch((error) => {
          console.log("GET ERROR:", error.message);
        });
    }, 1000);
  }

  React.useEffect(function () {
    if (url) {
      intervalId = setupGetResultsInterval();
    }

    return () => {
      // clear interval when component dismounts
      intervalId && clearInterval(intervalId);
    };
  }, []);

  function deleteHistory() {
    axios
      .delete(url)
      .then((response) => {
        const data = response.data || [];
        setApiResults(data);
      })
      .catch((error) => {
        console.log("DELETE ERROR:", error.message);
      });
  }

  const diceResults = apiResults || propResults;
  const diceResultsLines = diceResults
    ? diceResults.map(
        ({ rolls, modifier, sum, userName }) =>
          `${userName || "You"} just rolled a ${sum}! (Rolls: ${rolls.join(
            " + "
          )}, Modifier: ${modifier})`
      )
    : [];

  return (
    <div className="results">
      <>
        {apiResults?.length > 0 && (
          <button onClick={deleteHistory}>Delete History</button>
        )}
        {diceResults?.map(({ rolls, modifier, sum, userName }, index) => (
          <div key={rolls.join() + index} className="result">
            <span>
              <strong>
                {userName || "You"} just rolled a {sum}!
              </strong>{" "}
              (Rolls: {rolls.join(" + ")}, Modifier: {modifier})
            </span>
          </div>
        ))}
      </>
    </div>
  );
}

DiceResult.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      rolls: PropTypes.arrayOf(PropTypes.number).isRequired,
      modifier: PropTypes.number.isRequired,
      sum: PropTypes.number.isRequired,
      userName: PropTypes.string,
    })
  ),
  url: PropTypes.string,
};

export default DiceResult;
