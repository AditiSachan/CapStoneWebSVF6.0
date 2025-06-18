import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import TextField from '@mui/material/TextField';
import './shareLZSettingsModal.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Input = styled(MuiInput)`
  width: 42px;
`;

const style = {
  position: 'absolute' as const,
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ShareLZSettingsModal({
  open,
  handleClose,
  shareLink,
}: {
  open: boolean;
  handleClose: () => void;
  shareLink: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {});

    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Share
          </Typography>
          <div id="share-container">
            <textarea id="share-textArea" readOnly value={shareLink} />
            <div id="copy-icon-container">
              <ContentCopyIcon onClick={handleCopy} />
            </div>
          </div>
          {showTooltip && <div className="tooltip">Link copied to clipboard</div>}

          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
