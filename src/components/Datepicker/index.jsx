import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { usePrevious } from 'react-use';
import { DayPickerRangeController } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { IconButton, ClickAwayListener, Fade, Popper } from '@material-ui/core';
import TextInput from '../TextInput';
import { CalendarSvg } from '../SvgIcons';
import StyledWrapper from './StyledWrapper';
import { PRIMARY_COLOR } from '../../constants';

function NextPrevIcon({ next, prev, ...props }) {
  let icon = next ? <ChevronRightIcon /> :
    prev ? <ChevronLeftIcon /> :
    null;
  return (
    <IconButton size="small" {...props} css={`
      position: absolute;
      top: 17px;
      ${next ? 'right: 22px;' : ''}
      ${prev ? 'left: 22px;' : ''}
      .MuiSvgIcon-root {
        font-size: 30px;
      }
    `}>{icon}</IconButton>
  );
}

let mmParse = str => moment(str, 'YYYY/MM/DD', true);
let mmFormat = mm => mm ? mm.format('YYYY/MM/DD') : '';

export default function Datepicker({
  dateRange = [null, null],
  onChange = f => 0,
  disabled,
  popperRef,
  minDate, // YYYY/MM/DD
  maxDate, // YYYY/MM/DD
  numberOfMonths = 2,
  maxRange, // maximum number of days
  ...props
}) {
  let [startD, setStartD] = React.useState(null);
  let [endD, setEndD] = React.useState(null);
  React.useEffect(() => {
    let [start, end] = dateRange;
    setStartD(start);
    setEndD(end);
  }, [dateRange]);

  let [isEditing, setIsEditing] = React.useState(false);
  let [showPicker, setShowPicker] = React.useState(false);
  let prevShowPicker = usePrevious(showPicker);
  let [focusedInput, setFocusedInput] = React.useState(null);
  let anchorEl = React.useRef();
  let defaultPopperRef = React.useRef();
  popperRef = popperRef || defaultPopperRef;

  let onFocusChange = val => {
    if (!val) setShowPicker(false);
    setFocusedInput(val);
  };

  let onDatesChange = ({ startDate, endDate }) => {
    setStartD(startDate);
    setEndD(focusedInput === START_DATE ? null : endDate);
  };

  let openPicker = () => {
    setFocusedInput(START_DATE);
    setShowPicker(true);
  };

  let closePicker = () => {
    setShowPicker(false);
    setFocusedInput(null);
  };

  let togglePicker = () => showPicker ? closePicker() : openPicker();

  let onClickAway = e => {
    if (popperRef.current && popperRef.current.contains(e.target)) return;
    closePicker();
  };

  let [mMinDate, mMaxDate] = React.useMemo(
    () => [mmParse(minDate), mmParse(maxDate)],
    [minDate, maxDate]
  );

  let isOutsideRange = React.useCallback(date => {
    if (mMinDate.isValid() && date.isBefore(mMinDate, 'day')) return true;
    if (mMaxDate.isValid() && date.isAfter(mMaxDate, 'day')) return true;
    if (maxRange && startD) {
      if (focusedInput === END_DATE && date.isAfter(startD.clone().add(maxRange, 'days'), 'day')) {
        return true;
      }
    }
    
    return false;
  }, [mMinDate, mMaxDate, focusedInput, maxRange, startD]);

  let [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (isEditing) return;
    setInputValue(
      [startD, endD].filter(Boolean).map(mmFormat).join(' - ')
    );
  }, [isEditing, startD, endD]);

  let validate = React.useCallback((start, end) => {
    let [origStartDate, origEndDate] = dateRange;
    let [startDClone, endDClone] = [start && start.clone(), end && end.clone()];
    if (!startDClone || isOutsideRange(startDClone)) {
      startDClone = origStartDate.clone();
      endDClone = origEndDate.clone();
    }
    if (!endDClone || endDClone.isBefore(startDClone, 'day') || isOutsideRange(endDClone)) {
      endDClone = startDClone.clone();
    }
    if (maxRange && Math.abs(startDClone.diff(endDClone, 'days')) > maxRange) {
      endDClone = startDClone.clone().add(maxRange, 'days');
    }
    return [startDClone, endDClone];
  }, [isOutsideRange, maxRange, dateRange]);

  React.useEffect(() => {
    // run this effect when datepicker is closed
    if (prevShowPicker && !showPicker) {
      onChange(validate(startD, endD));
    }
  }, [prevShowPicker, showPicker, startD, endD, validate, onChange]);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div {...props}>
        <TextInput
          disabled={disabled}
          InputProps={{
            className: clsx(showPicker && 'Mui-focused'),
            endAdornment: (
              <IconButton edge="end" onClick={togglePicker}>
                <CalendarSvg css={`
                  font-size: 16px;
                  color: rgba(50, 60, 81, .64);
                  .Mui-focused & {
                    color: ${PRIMARY_COLOR};
                  }
                `} />
              </IconButton>
            )
          }}
          onFocus={e => {
            openPicker();
            setIsEditing(true);
          }}
          onBlur={e => {
            setIsEditing(false);
          }}
          inputRef={anchorEl}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);

            /**
             * because react-dates doesn't provide API for validating dates in input fields
             * so we'll have to implement our own validations
             */
            let [_startDateStr, _endDateStr] = e.target.value.split('-').map(x => x.trim()).filter(Boolean);
            let [_startDate, _endDate] = [mmParse(_startDateStr), mmParse(_endDateStr)];
            if (!_startDate.isValid() || !_endDate.isValid()) return;
            
            let [newStart, newEnd] = validate(_startDate, _endDate);
            setStartD(newStart);
            setEndD(newEnd);
          }}
        />
        <Popper
          css="z-index: 1300"
          open={showPicker}
          anchorEl={anchorEl.current}
          transition
          placement="bottom-start"
          ref={popperRef}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <StyledWrapper>
                <DayPickerRangeController
                  minimumNights={0}
                  startDate={startD}
                  endDate={endD}
                  onDatesChange={onDatesChange}
                  navNext={<NextPrevIcon next />}
                  navPrev={<NextPrevIcon prev />}
                  focusedInput={focusedInput}
                  onFocusChange={onFocusChange}
                  numberOfMonths={numberOfMonths}
                  monthFormat="YYYY년 M월"
                  isOutsideRange={isOutsideRange}
                />
              </StyledWrapper>
            </Fade>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};
