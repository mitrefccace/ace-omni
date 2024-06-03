import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import './ADSPagination.css';

/**
 * Returns ADS Pagination
 *
 * @param totalPages - Number of paginated pages
 * @param onChange - Pass value from updating pagination pages
 *
 * @returns ADS Pagination
 */

function ADSPagination(props: {
  onChange: Function;
  totalPages?: number;
}) {
  const {
    onChange,
    totalPages
  } = props;
  const [page, setPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    onChange(value);
  };

  const findPrevNext = () => {
    const prevNexts = document.getElementsByClassName('MuiPaginationItem-previousNext');
    let counter = 0;
    for (let i = 0; i < prevNexts.length; i += 1) {
      const prevNext = prevNexts[i];
      const child = prevNext.firstChild;
      if (child) {
        if (child.nodeName === 'svg') {
          child.remove();
          const textTag = document.createElement('p');
          textTag.className = 'previousNextNavigation';
          if (counter === 0) {
            const previousNav = document.createTextNode('Previous');
            textTag.appendChild(previousNav);
            prevNext.appendChild(textTag);
            counter += 1;
          } else {
            const nextNav = document.createTextNode('Next');
            textTag.appendChild(nextNav);
            prevNext.appendChild(textTag);
          }
        }
      }
    }
  };
  useEffect(() => {
    findPrevNext();
  });

  return (
    <div>
      <Pagination
        count={totalPages}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
        page={page}
      />
    </div>
  );
}
ADSPagination.defaultProps = {
  totalPages: 1
};

export default ADSPagination;
