import React from "react";
import GitHubIcon from "@material-ui/icons/GitHub";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import { Spinner } from "react-bootstrap"; // Import Bootstrap Spinner

class ExternalLinks extends React.Component {
  render() {
    const { githubLink, openLink, showSpinner } = this.props;

    return (
      <span className="external-links">
        <a className="github-icon" href={githubLink} target="_blank" rel="noopener noreferrer">
          <GitHubIcon
            style={{
              fontSize: 20,
              color: "var(--lightest-slate)",
              marginRight: showSpinner ? '10px' : '0' // Adjust spacing if spinner is present
            }}
          />
          {showSpinner && (
            <Spinner
              animation="border"
              style={{
                width: '20px',
                height: '20px',
                marginLeft: '5px',
                verticalAlign: 'middle'
              }}
            />
          )}
        </a>
        {openLink && !showSpinner && (
          <a className="open-icon" href={openLink} target="_blank" rel="noopener noreferrer">
            <OpenInBrowserIcon
              style={{
                fontSize: 25,
                color: "var(--lightest-slate)"
              }}
            />
          </a>
        )}
      </span>
    );
  }
}

export default ExternalLinks;