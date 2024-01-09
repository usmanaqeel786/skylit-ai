# streaming.py

from datetime import date
from thetadata import ThetaClient, StreamMsg, StreamMsgType

def streaming(callback):
    client = ThetaClient(username="jimin@skylit.ai", passwd="Glitch!2023")
    client.connect_stream(callback)
    client.req_full_open_interest_stream()

if __name__ == "__main__":
    def callback(msg: StreamMsg):
        if msg.type == StreamMsgType.OPEN_INTEREST:
            # if msg.contract.root in ["SPX", "SPXW"]:
                print('con:' + msg.contract.to_string() + ' open_interest: ' + msg.open_interest.to_string())

    streaming(callback)
