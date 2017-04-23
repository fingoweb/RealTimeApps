import io from 'socket.io-client';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import React from 'react';
import ReactDOM  from 'react-dom';
import rx from 'feathers-reactive';
import RxJS from 'rxjs';

const socket = io();
const app = feathers()
  .configure(socketio(socket))
  .configure(rx(RxJS));

const commentService = app.service('comments');

class CommentsList extends React.Component {
  componentDidMount() {
    commentService.find({ query: {
        $sort: {
          created: 1
        }
      }})
      .subscribe(comments => this.setState({comments}));
  }

  remove(item) {
    commentService.remove(item.id);
    return false;
  }

  render() {
    if (this.state && this.state.comments) {
      return <div>
        {this.state.comments.map(comment =>
          <div key={comment.id}>
            <div>{comment.text}</div>
            <pre>Created: {new Date(comment.created).toISOString()} <a href="#" onClick={this.remove.bind(this, comment)}>x</a><br/></pre>
            <hr/>
          </div>
        )}
        <pre>Rendered:{new Date().toISOString()}</pre>
      </div>;
    }

    return null;
  }
}

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      created: null
    };
  }

  updateProperty(prop, ev) {
    this.setState({[prop]: ev.target.value});
  }

  submit(ev) {
    ev.preventDefault();

    commentService.create({
      text: this.state.text,
      created: Date.now()
    }).then(() => this.setState({
      text: '',
      created: null
    }));
  }

  render() {
    return <form onSubmit={this.submit.bind(this)}>
      <div>
        <div>Comment:</div>
        <div>
          <input type="text" onChange={this.updateProperty.bind(this, 'text')} value={this.state.text}/>
        </div>
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>;
  }
}

ReactDOM.render(<div>
  <CommentsList />
  <CommentForm />
</div>, document.getElementById('app'));







