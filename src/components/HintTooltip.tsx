import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

interface HintTooltipProps {
  children: ReactNode;
}

const HintTooltip: React.FC<HintTooltipProps> = ({ children }) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="help-tooltip">
          {children}
        </Tooltip>
      }
    >
      <span>
        <FontAwesomeIcon icon={faCircleQuestion} size="sm" color="#000" />
      </span>
    </OverlayTrigger>
  );
};

export default HintTooltip;
