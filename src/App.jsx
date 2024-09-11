import { useEffect, useState } from 'react';
import JobPosting from './components/JobPosting';

const ITEMS_PER_PAGE = 6;
const API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0';

function App() {
  const [items, setItems] = useState([]);
  const [itemIds, setItemIds] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchItems = async (currPage) => {
    setCurrentPage(currPage);
    setFetchingDetails(true);

    let itemsList = itemIds;
    if (itemIds === null) {
      const response = await fetch(`${API_ENDPOINT}/jobstories.json`);
      itemsList = await response.json();
      setItemIds(itemsList);
    }

    const itemIdsForPage = itemsList.slice(
      currPage * ITEMS_PER_PAGE,
      currPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );

    const itemsForPage = await Promise.all(
      itemIdsForPage.map((itemId) =>
        fetch(`${API_ENDPOINT}/item/${itemId}.json`).then((res) => res.json())
      )
    );

    setItems([...items, ...itemsForPage]);
    setFetchingDetails(false);
  };

  useEffect(() => {
    if (currentPage === 0) {
      fetchItems(currentPage);
    }
  }, []);

  return (
    <div className='custom-app'>
      <h1 className='custom-title'>Hacker News Job Board</h1>
      {itemIds === null || items.length < 1 ? (
        <p className='custom-loading'>loading...</p>
      ) : (
        <div>
          <div className='custom-items' role='list'>
            {items.map((item) => (
              <JobPosting key={item.id} {...item} />
            ))}
          </div>
          <button
            className='custom-load-more-button'
            disabled={fetchingDetails}
            onClick={() => fetchItems(currentPage + 1)}
          >
            {fetchingDetails ? 'Loading...' : 'Load more jobs'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
