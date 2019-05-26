import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import { TrendingUpOutlined, TrendingDownOutlined } from '@material-ui/icons';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const socketSetting = () => {
  const sock = new SockJS('http://localhost:8080/ws');
  const client = Stomp.over(sock);
  return client;
};

const Index = () => {
  const [name, setName] = useState('crypto-currency-trader');
  const [markets, setMarkets] = useState({
    'KRW-BTC': null,
    'KRW-BCH': null,
    'KRW-ETC': null,
    'KRW-ETH': null,
    'KRW-LTC': null,
    'KRW-EOS': null,
    'KRW-OMG': null,
    'KRW-ADA': null,
    'KRW-XRP': null,
    'KRW-XLM': null,
    'KRW-ZIL': null,
  });
  const ws = useMemo(() => socketSetting(), []);

  useEffect(() => {
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
    markets[msgBody.code] = msgBody;
    setMarkets({ ...markets });
    console.log(markets);
  };

  const disconnect = ws => {
    console.log('Socket disconnect');
    ws.disconnect();
  };

  const onError = () => {
    console.error('Could not connect to WebSocket Server..!');
  };

  return (
    <>
      <Head />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Crypto-Currency Trade Volume
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        {Object.keys(markets).map((m, i) => (
          <ListItem key={m}>
            <Avatar style={{ backgroundColor: 'transparent' }}>
              {markets[m] &&
              markets[m].change_rate &&
              markets[m].change_rate < 0 ? (
                <TrendingDownOutlined style={{ color: 'blue' }} />
              ) : (
                <TrendingUpOutlined style={{ color: 'red' }} />
              )}
            </Avatar>
            <ListItemText primary={`${m} - ${markets[m]}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Index;
