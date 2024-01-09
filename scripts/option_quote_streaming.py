from datetime import date
from thetadata import ThetaClient, OptionRight, StreamMsg, StreamMsgType, StreamResponseType


def streaming():
    # Credentials now required because streaming is only available to ThetaData Standard & Pro subscribers.
    client = ThetaClient(username="jimin@skylit.ai", passwd="Glitch!2023")
    client.connect_stream(callback) # You can stop streaming by calling client.close_stream
    # This contract is likely expired! Replace it with a contract that isn't expired
    req_id = client.req_quote_stream_opt("AAPL", date(2023, 7, 21), 170, OptionRight.CALL)
    # Verify that the request to stream was successful.
    response = client.verify(req_id)
    if response == StreamResponseType.SUBSCRIBED:
        print('The request to stream option quotes was successful.')
    elif response == StreamResponseType.INVALID_PERMS:
        print('Invalid permissions to stream option quotes. Theta Data Options Standard or Pro account required.')
    elif response == StreamResponseType.MAX_STREAMS_REACHED:
        print('You have reached your limit for the amount of option contracts you can stream quotes for.')
    else:
        print('Unexpected stream response: ' + str(response))
    # User generated method that gets called each time a message from the stream arrives.
def callback(msg: StreamMsg):
    msg.type = msg.type
    if msg.type == StreamMsgType.QUOTE:
        print('---------------------------------------------------------------------------')
        print('con: ' + msg.contract.to_string())
        print('quote: ' + msg.quote.to_string())

if __name__ == "__main__":
    streaming()