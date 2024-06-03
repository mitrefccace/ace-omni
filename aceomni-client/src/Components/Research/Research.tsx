import React, { useEffect, useState } from 'react';
/* import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; */

function Research() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const pageName = window.location.href.split('/').pop();
    console.log(`FETCHING ${process.env.REACT_APP_LOCATION}/api/${pageName}`);
    fetch(`${process.env.REACT_APP_LOCATION}/api/exp/${pageName}`)
      .then((res) => res.json())
      .then((data) => {
        setDisplayText(data.msg);
      });
  }, []);

  /* function loadPage() {
    // SET UP THE MONGO CALL HERE FROM A PARAMETER
  } */

  return (
    <main>
      {displayText === 'abc'
        ? <span>abc is here</span>
        : <span>No abc</span>}
      Begin research here <br />
      <b>{displayText}</b>
    </main>
  );
}

export default Research;
