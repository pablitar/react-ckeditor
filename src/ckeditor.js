import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
const loadScript = require('load-script');

var defaultScriptUrl = "https://cdn.ckeditor.com/4.6.2/standard/ckeditor.js";

/**
 * @author codeslayer1
 * @description CKEditor component to render a CKEditor textarea with defined configs and onChange callback handler
 */
class CKEditor extends React.Component {
  constructor(props) {
    super(props);

    //Bindings
    this.onLoad = this.onLoad.bind(this);

    //State initialization
    this.state = {
      isScriptLoaded: this.props.isScriptLoaded,
      config: this.props.config
    };
  }

  //load ckeditor script as soon as component mounts if not already loaded
  componentDidMount() {
    if(!this.props.isScriptLoaded){
      loadScript(this.props.scriptUrl, this.onLoad);
    }else{
      this.onLoad();
    }
  }

  onLoad(){
    this.setState({
      isScriptLoaded: true
    });

    if (!window.CKEDITOR) {
      console.error("CKEditor not found");
      return;
    }

    this.editorInstance = window.CKEDITOR.appendTo(
      ReactDOM.findDOMNode(this),
      this.state.config,
      this.props.content
    );

    this.editorInstance.on("change", () => {
      const content = this.editorInstance.getData();

      //call callback if present
      if(this.props.onChange){
        this.props.onChange(content);
      }
    });

    if(this.props.onLoad) {
      this.props.onLoad()
    }
  }

  render() {
    return <div className={this.props.activeClass} />;
  }
}

CKEditor.defaultProps = {
  content: "",
  config: {},
  isScriptLoaded: false,
  scriptUrl: defaultScriptUrl,
  activeClass: ""
};

CKEditor.propTypes = {
  content: PropTypes.any,
  config: PropTypes.object,
  onChange: PropTypes.func,
  isScriptLoaded: PropTypes.bool,
  scriptUrl: PropTypes.string,
  activeClass: PropTypes.string,
  onLoad: PropTypes.func
};

export default CKEditor;
