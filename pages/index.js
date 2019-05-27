import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { AppBar, Toolbar, Typography, List } from '@material-ui/core';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import MarketInfo from '../components/MarketInfo';

const socketSetting = () => {
  const sock = new SockJS('http://localhost:8080/ws');
  const client = Stomp.over(sock);
  return client;
};

const Index = () => {
  // const [name, setName] = useState('crypto-currency-trader');
  const [markets, setMarkets] = useState([
    { name: 'KRW-BTC', data: null },
    { name: 'KRW-BCH', data: null },
    { name: 'KRW-ETC', data: null },
    { name: 'KRW-ETH', data: null },
    { name: 'KRW-LTC', data: null },
    { name: 'KRW-EOS', data: null },
    { name: 'KRW-OMG', data: null },
    { name: 'KRW-ADA', data: null },
    { name: 'KRW-XRP', data: null },
    { name: 'KRW-XLM', data: null },
    { name: 'KRW-ZIL', data: null },
  ]);
  const ws = useMemo(() => socketSetting(), []);

  useEffect(() => {
    console.log(markets);
    ws.connect({}, onConnect, onError);

    ws.onopen = () => {
      console.log(ws);
      ws.send('/app/chat', {}, JSON.stringify({ name }));
    };
    return () => {
      console.log('unmount..');
      disconnect(ws);
    };
  }, []);

  const onConnect = () => {
    ws.send('/app/chat', {}, JSON.stringify({ name: 'user' }));
    ws.subscribe('/market/data', onMessageReceived);
  };

  const onMessageReceived = msg => {
    const msgBody = JSON.parse(msg.body);
    markets[msgBody.code] = markets[msgBody.code]
      ? {
          ...msgBody,
          amount: markets[msgBody.code].amount + msgBody.amount,
        }
      : msgBody;
    setMarkets({ ...markets });
  };

  const disconnect = ws => {
    console.log('Socket disconnect');
    ws.disconnect();
  };

  const onError = () => {
    console.error('Could not connect to WebSocket Server..!');
  };

  const sortingMarket = () => {
    return markets.sort((a, b) => {
      return a.data && b.data ? b.data.amount - a.data.amount : a.data ? -1 : 1; // amount desc
    });
  };

  return (
    <>
      <Head />
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='title' color='inherit'>
            Crypto-Currency Trade Volume
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        {sortingMarket().map(m => (
          <MarketInfo key={m.name} market={m} />
        ))}
      </List>
    </>
  );
};

export default Index;
