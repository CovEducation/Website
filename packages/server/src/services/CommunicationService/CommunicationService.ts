class CommunicationService {
  constructor() {
    this.connect();
  }

  private connect() {
    // TODO(johancc) - Add email / sms connections.
  }

  sendEmail(_sender: string, _recipient: string, _email: string) {}
}

export default CommunicationService;
