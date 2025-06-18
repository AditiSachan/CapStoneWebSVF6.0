import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import FormatSizeIcon from '@mui/icons-material/FormatSize';

const Input = styled(MuiInput)`
  width: 42px;
`;

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SettingsModal({
  open,
  handleClose,
  codeFontSize,
  setCodeFontSize,
  llvmIRFontSize,
  setLLVMIRFontSize,
  terminalOutputFontSize,
  setTerminalOutputFontSize,
}: {
  open: boolean;
  handleClose: () => void;
  codeFontSize: number;
  setCodeFontSize: (codeFontSize: number) => void;
  llvmIRFontSize: number;
  setLLVMIRFontSize: (llvmIRFontSize: number) => void;
  terminalOutputFontSize: number;
  setTerminalOutputFontSize: (terminalOutputFontSize: number) => void;
}) {
  const handleCodeSliderChange = (event: Event, newValue: number | number[]) => {
    setCodeFontSize(newValue as number);
  };
  const handleLLVMSliderChange = (event: Event, newValue: number | number[]) => {
    setLLVMIRFontSize(newValue as number);
  };
  const handleTerminalSliderChange = (event: Event, newValue: number | number[]) => {
    setTerminalOutputFontSize(newValue as number);
  };

  const handleCodeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodeFontSize(event.target.value === '' ? 0 : Number(event.target.value));
  };
  const handleLLVMInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLLVMIRFontSize(event.target.value === '' ? 0 : Number(event.target.value));
  };
  const handleTerminalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerminalOutputFontSize(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (codeFontSize < 0) {
      setCodeFontSize(10);
    } else if (codeFontSize > 48) {
      setCodeFontSize(48);
    }
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
            Settings
          </Typography>
          {/* Code Editor font size */}
          <Typography id="input-slider" gutterBottom>
            Code Editor Font Size
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormatSizeIcon />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof codeFontSize === 'number' ? codeFontSize : 10}
                onChange={handleCodeSliderChange}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                value={codeFontSize}
                size="small"
                onChange={handleCodeInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 10,
                  max: 48,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>
          {/* Terminal Output font size */}
          <Typography id="input-slider" gutterBottom>
            Terminal Output Font Size
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormatSizeIcon />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof terminalOutputFontSize === 'number' ? terminalOutputFontSize : 10}
                onChange={handleTerminalSliderChange}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                value={terminalOutputFontSize}
                size="small"
                onChange={handleTerminalInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 10,
                  max: 48,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>
          {/* LLVMIR Output font size */}
          <Typography id="input-slider" gutterBottom>
            LLVMIR Font Size
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormatSizeIcon />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof llvmIRFontSize === 'number' ? llvmIRFontSize : 10}
                onChange={handleLLVMSliderChange}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                value={llvmIRFontSize}
                size="small"
                onChange={handleLLVMInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 10,
                  max: 48,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>

          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
