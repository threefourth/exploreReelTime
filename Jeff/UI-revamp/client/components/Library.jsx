import React from 'react';

class Library extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentFilename: this.props.filename,
      filenames: []
    }
  }

  // componentDidMount() {
  //   this.setState({
  //     currentFilename: this.props.filename
  //   });
  // }

  handleAddMedia(media) {
    var that = this;

    this.setState({
      currentFilename: media.name,
      filenames: that.state.filenames.push(media.name)
    });
  }

  render() {
    console.log('inside Library.jsx, this is this.state.currentFilename:', this.state.currentFilename);

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
                <h3>{this.state.currentFilename}</h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};  

export default Library;