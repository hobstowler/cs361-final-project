import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes, useSearchParams} from 'react-router-dom';
import Cookies from "js-cookie";
import {useState, useEffect} from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Search from "./components/Search";
import Watchlist from "./components/Watchlist";
import Portfolio from "./components/Portfolio";
import Stories from "./components/Stories";


function App() {
    const [username, setUsername] = useState('')
    const [stock, setStock] = useState('')
    const [watchNotify, setWatchNotify] = useState(false)
    const [portfolioNotify, setPortfolioNotify] = useState(false)

    // add a stock to the user's watch or portfolio list
    const addStock = (type, stock) => {
        fetch(`/${type}/${username}/${stock.toUpperCase()}`, {
            method: 'POST'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                if (type === 'watchlist') {
                    setWatchNotify(!watchNotify)
                } else if (type === 'portfolio') {
                    setPortfolioNotify(!portfolioNotify)
                }
            })
    }

    const removeStock = (type, stock) => {
        fetch(`/${type}/${username}/${stock}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 204) {
                    if (type === 'watchlist') {
                        setWatchNotify(!watchNotify)
                    } else if (type === 'portfolio') {
                        setPortfolioNotify(!portfolioNotify)
                    }
                }
            })
    }

    useEffect(() => {
        let username = Cookies.get('username')
        if (username !== undefined) {
            setUsername(username)
        }
    }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Header username={username}
                setUsername={setUsername} />
        <Search username={username}
                addStock={addStock}
                setWatchNotify={setWatchNotify}
                setPortfolioNotify={setPortfolioNotify} />
          <div className='bodyWrap'>
              <div className='left'>
                  <Watchlist username={username}
                             notify={watchNotify}
                             setNotify={setWatchNotify}
                             removeStock={removeStock} />
                  <Portfolio username={username}
                             notify={portfolioNotify}
                             setNotify={setPortfolioNotify}
                             removeStock={removeStock} />
              </div>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/detail" element={<Detail stock={stock}
                                                         addStock={addStock}
                                                         setStock={setStock} />}/>
              </Routes>
              <div className='right'>
                  <Stories stock={stock} />
              </div>
          </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
