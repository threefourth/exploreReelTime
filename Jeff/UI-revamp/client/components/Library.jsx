import React from 'react';

class Library extends React.Component {
  constructor(props) {
    console.log('Inside constructor.');

    super(props);

    this.state = {
      filenames: []
    };    

    this.updateLibraryList();
  }

  updateLibraryList() {
    console.log('Inside updateLibraryList.');

    this.props.socket.emit('request files');

    var that = this;
    this.props.socket.on('send files', (files) => {
      console.log('Received filenames from server', files);

      that.setState({
        filenames: files
      });
    });
  }

  setFileAndUpdateLibrary(e) {
    console.log('Inside setFileAndUpdateLibrary');
    console.log('this inside setFileAndUpdateLibrary', this);

    this.props.setFile(e);
    this.updateLibraryList();
  }

  // componentWillUpdate() {
  //   console.log('Inside componentWillUpdate.');
  // }

  render() {
    console.log('Rendering Library.');

    return (
      <div className="library-list">
        <table>
          <thead> 
            <tr>
              <th>
                <h1>Files</h1>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                {this.state.filenames.map(file => <tr>{file}</tr>)}
              </td>
            </tr>
            <tr>
              <div className="landing-drop-text landing-circle">
                Drop Your Video File Here
                <input type="file" id="files" className="landing-circle drop-box" name="file" onChange={this.setFileAndUpdateLibrary.bind(this)} />
              </div>
            </tr>
          </tbody>
        </table>
        
      </div>
    );
  }
};  

export default Library;