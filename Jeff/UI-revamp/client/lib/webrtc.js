import Peer from 'peerjs';

const peer = new Peer({ key: 'dyf2h2fyul2nvcxr' });

// Returns a Promise that is resolved with this peer's ID, assigned by the signaling server.
const getMyId = () => new Promise((resolve, reject) => {
  if (!peer.id) {
    // ID not received yet. Listen for open event.
    peer.on('open', resolve);
    peer.on('error', reject);
  } else {
    // ID already exists; resolve.
    resolve(peer.id);
  }
});

// Returns a Promise that is resolved with an active peer.js DataConnection.
// If sourceId is specified, this will connect to an existing peer with that source ID.
// If sourceId is not specified, this will listen for an incoming connection.
const establishPeerConnection = (sourceId) => new Promise((resolve, reject) => {
  const connect = () => {
    if (sourceId) {
      const conn = peer.connect(sourceId, { reliable: true });

      conn.on('open', () => {
        console.log('RTC data connection established - acting as receiver');
        resolve(conn);
      });

      conn.on('error', (error) => {
        reject(error);
      });
    } else {
      peer.on('connection', (conn) => {
        conn.on('open', () => {
          console.log('RTC data connection established - acting as source');
          resolve(conn);
        });
      });

      peer.on('error', (error) => {
        reject(error);
      });
    }
  };

  if (peer.disconnected) {
    peer.on('open', connect);
    peer.on('error', reject);
  } else {
    connect();
  }
});

// Returns a Promise that is resolved with an active peer.js MediaConnection.
// A MediaStream in active state must be provided as the first argument.
// If sourceId is specified, this will connect to an existing peer with that source ID.
// If sourceId is not specified, this will listen for an incoming connection.
const establishPeerCall = (mediaStream, sourceId) => new Promise((resolve, reject) => {
  const connect = () => {
    if (sourceId) {
      const call = peer.call(sourceId, mediaStream);

      call.on('stream', (stream) => {
        console.log('RTC call established - acting as receiver');
        resolve(stream);
      });

      call.on('error', (error) => {
        reject(error);
      });
    } else {
      peer.on('call', (call) => {
        call.answer(mediaStream);
        call.on('stream', (stream) => {
          console.log('RTC call established - acting as source');
          resolve(stream);
        });
      });

      peer.on('error', (error) => {
        reject(error);
      });
    }
  };

  if (peer.disconnected) {
    peer.on('open', connect);
    peer.on('error', reject);
  } else {
    connect();
  }
});

export {
  getMyId,
  establishPeerConnection,
  establishPeerCall,
};
