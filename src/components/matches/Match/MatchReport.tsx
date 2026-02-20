 
import React, {useState} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {PlayerAutoComplete} from '../../players/PlayerAutoComplete';
import ImageDropzone from '../../controls/image/ImageDropzone';
const QuillEditor = React.lazy(() => import('../../controls/Editor'));
import {MaterialButton} from '../../controls/Buttons/MaterialButton';
import {Icon} from '../../controls/Icons/Icon';
import {EditIcon} from '../../controls/Icons/EditIcon';
import {TimeAgo} from '../../controls/controls/TimeAgo';
import {IMatch, IMatchComment} from '../../../models/model-interfaces';
import { t } from '../../../locales';
import storeUtil from '../../../storeUtil';
import { selectUser, useTtcDispatch, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { deleteComment, postComment, postReport } from '../../../reducers/matchesReducer';
import { useViewport } from '../../../utils/hooks/useViewport';
import { config, getStaticFileUrl } from '../../../config';

function getEmptyComment(matchId: number, playerId: number): IMatchComment {
  return {
    id: 0,
    matchId,
    playerId,
    text: '',
    hidden: false,
    postedOn: null,
    imageUrl: '',
  };
}

type MatchReportProps = {
  match: IMatch;
  skipContainerClass?: boolean;
}


export const MatchReport = ({match, skipContainerClass}: MatchReportProps) => {
  const user = useTtcSelector(selectUser);
  const dispatch = useTtcDispatch();
  const viewport = useViewport();
  const [text, setText] = useState(match.description);
  const [commentImageFormOpen, setCommentImageFormOpen] = useState(false);
  const [commentFormOpen, setCommentFormOpen] = useState(false);
  const [comment, setComment] = useState(getEmptyComment(match.id, user.playerId));
  const [reportFormOpen, setReportFormOpen] = useState(false);

  const onCommentImageUploaded = (fileName: string) => {
    setCommentFormOpen(false);
    dispatch(postComment({...getEmptyComment(match.id, user.playerId), imageUrl: fileName}));
  };

  const openPictureForm = () => {
    setCommentImageFormOpen(!commentImageFormOpen);
    setCommentFormOpen(false);
  };

  const editorHeight = 200;
  const editorToolbarHeight = 44; // Quill snow theme toolbar height

  let reportWriterText: React.ReactNode;
  const reportWriter = storeUtil.getPlayer(match.reportPlayerId);
  if (match.reportPlayerId && reportWriter) {
    reportWriterText = (
      <div style={{marginTop: -10, color: '#736F6E'}}>
        <small>{t('match.report.reportWrittenBy', reportWriter.alias)}</small>
      </div>
    );
  }

  const readonlyReport = text ? (
    <pre
      dangerouslySetInnerHTML={{__html: text}}  
      style={{marginRight: 15, whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflow: 'visible'}}
    />
  ) : null;

  let reportText: any;
  const canComment = !!user.playerId;
  const showComments = canComment || match.comments.length;
  const canPostReport = user.canPostReport(match.teamId) && match.isScoreComplete();
  if (match.isScoreComplete()) {
    reportText = (
      <div>
        {reportWriterText}
        {canPostReport ? (
          <div>
            {reportFormOpen ? (
              <div>
                <div style={{height: editorHeight + editorToolbarHeight, marginRight: 15, marginBottom: 16}}>
                  <QuillEditor
                    text={text}
                    style={{height: editorHeight}}
                    onChange={txt => setText(txt)}
                    readOnly={!canPostReport}
                  />
                </div>

                <div style={{textAlign: 'right', marginRight: 15, paddingTop: 12}}>
                  <MaterialButton
                    variant="contained"
                    label={t('common.save')}
                    color="primary"
                    onClick={() => {
                      dispatch(postReport({matchId: match.id, text, playerId: user.playerId}));
                      setReportFormOpen(false);
                    }}
                  />
                </div>
              </div>
            ) : readonlyReport}
          </div>
        ) : readonlyReport}
      </div>
    );
  } else if (text) {
    reportText = readonlyReport;
  }

  if (!canPostReport && !text && !showComments) {
    reportText = t('match.report.noReport');
  }

  let comments: any;
  if (showComments) {
    comments = (
      <div>
        {text || reportFormOpen ? (
          <h3 style={{marginTop: reportFormOpen ? 16 : 0}}>
            {t('match.report.commentsTitle')}
          </h3>
        ) : null}
        {match.comments.map(c => (
          <Comment key={c.id} comment={c} />
        ))}
        {commentFormOpen ? (
          <div>
            {user.isSystem() ? (
              <div style={{marginBottom: 12, paddingRight: 15}}>
                <PlayerAutoComplete
                  selectPlayer={playerId => typeof playerId === 'number' && setComment({...comment, playerId})}
                  label={t('system.playerSelect')}
                />
              </div>
            ) : null}
            <div style={{height: editorHeight + editorToolbarHeight, marginRight: 15, marginBottom: 16}}>
              <QuillEditor
                text={comment.text}
                style={{height: editorHeight}}
                onChange={txt => setComment({...comment, text: txt})}
                readOnly={!canComment}
              />
            </div>
          </div>
        ) : commentImageFormOpen ? (
          <div style={{marginBottom: 12}}>
            <ImageDropzone
              fileUploaded={fileName => onCommentImageUploaded(fileName)}
              type="match"
              typeId={match.id}
            />
          </div>
        ) : null}

        {user.playerId ? (
          <div style={{width: '100%', paddingTop: 16}}>
            {commentFormOpen && (
              <FormControlLabel
                style={{float: 'right', textAlign: 'right'}}
                control={(
                  <Checkbox
                    checked={!comment.hidden}
                    onChange={() => setComment({...comment, hidden: !comment.hidden})}
                    value="hidden"
                    color="primary"
                  />
                )}
                label={t('match.report.commentVisible')}
              />
            )}

            <MaterialButton
              label={t(`match.report.commentsOpenForm${commentFormOpen ? 'Confirm' : ''}`)}
              color="primary"
              variant={commentFormOpen ? 'contained' : 'outlined'}
              onClick={() => {
                if (commentFormOpen) {
                  if (comment.text) {
                    dispatch(postComment(comment));
                    setComment(getEmptyComment(match.id, user.playerId));
                    setCommentFormOpen(false);
                  }
                } else {
                  setCommentFormOpen(true);
                }
              }}
            />


            <button type="button" className="btn btn-outline-primary" style={{marginLeft: 15}} onClick={openPictureForm}>
              <Icon fa="fa fa-picture-o" translate tooltip="match.report.commentsPhotoTooltip" tooltipPlacement="right" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={skipContainerClass ? '' : 'match-card-tab-content'}>
      <h3>
        {t('match.report.title')}
        {canPostReport ? (
          <small>
            <EditIcon
              tooltip={t('match.report.editTooltip')}
              onClick={() => setReportFormOpen(!reportFormOpen)}
              style={{marginLeft: 5, color: '#D3D3D3'}}
            />
          </small>
        ) : null}
      </h3>
      {reportText}
      {comments}
    </div>
  );
};



type CommentProps = {
  comment: IMatchComment;
}

const Comment = ({comment}: CommentProps) => {
  const [hover, setHover] = useState(false);
  const user = useTtcSelector(selectUser);
  const dispatch = useTtcDispatch();

  const canDeleteComment = user.isAdmin() || comment.playerId === user.playerId;
  const poster = storeUtil.getPlayer(comment.playerId) || {alias: 'SYSTEM'};

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={({padding: 6, marginRight: 10, ...(hover ? {backgroundColor: '#EEE9E9'} : {})})}
    >

      <div style={{display: 'inline-block', width: '100%'}}>
        {hover && canDeleteComment ? (
          <div className="pull-right" style={{marginTop: 6}}>
            <Icon fa="fa fa-trash-o fa-lg" onClick={() => dispatch(deleteComment({id: comment.id}))} />
          </div>
        ) : null}
        {comment.hidden ? <Icon fa="fa fa-user-secret" translate tooltip="match.report.commentHidden" /> : null}
        <strong style={{marginRight: 6}}>{poster.alias}</strong>
        <TimeAgo date={comment.postedOn} />
      </div>

      {comment.imageUrl ? (
        <div><img src={getStaticFileUrl(comment.imageUrl)} style={{maxWidth: '95%'}} alt="Door de speler opgeladen" /></div>
      ) : (
        <div dangerouslySetInnerHTML={{__html: comment.text}} />  
      )}
    </div>
  );
};
