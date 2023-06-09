import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authAtom, userState } from "../recoil";
import axios from "axios";
import {
  CreateBoardWrapper,
  BoardContentWrapper,
  ContentImgWrapper,
} from "../styles/NewEmotion";
import { MainColorShortBtn } from "../styles/BtnsEmotion";

import { BACKEND_URL, DUMMY_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentEditImg } from "../styles/BoardEmotion";
import Loading from "../assets/loading.gif";

const EditBoard = () => {
  const navigate = useNavigate();
  const auth = useRecoilValue(authAtom);
  const setAuth = useSetRecoilState(authAtom);

  const [user, setUser] = useRecoilState(userState);

  const [boardData, setBoardData] = useState();
  const [dogId, setDogId] = useState();
  const [content, setContent] = useState();
  const [isLoading, setLoading] = useState(true);
  const contentRef = useRef();

  const location = useLocation();
  const boardId = location.pathname.split("/").reverse()[0];

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setAuth(null);
    console.log("로그아웃이 정상적으로 처리되었습니다.");
    navigate("/login");
  };

  useEffect(() => {
    if (!auth || !localStorage.getItem("recoil-persist")) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BACKEND_URL}/board/${boardId}`, {
        headers: {
          Authorization: auth,
        },
      })
      .then((resp) => {
        setBoardData(resp.data.board);
        // 본인의 게시물이 아닌 경우
        if (user.userId !== resp.data.board.userId) {
          alert("게시물 수정 권한이 없습니다.");
          navigate(`/feed/${user.userId}`);
        }
        setContent(resp.data.board.content);
        setDogId(resp.data.board.dog.dogId);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("자동 로그아웃되었습니다.");
          handleLogout();
        }
      });
  }, []);

  const onClickEdit = () => {
    axios
      .put(`${BACKEND_URL}/board`, null, {
        params: {
          boardId: boardId,
          content: content,
        },
        headers: {
          Authorization: auth,
        },
      })
      .then((resp) => {
        alert("게시물 수정이 완료되었습니다.");
        window.location.replace(`/board/${boardId}`);
      })
      .catch((err) => {});
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <img src={Loading} alt="loading..." />
      </div>
    );
  }

  return (
    <CreateBoardWrapper>
      <div className="boardHeader">게시글 수정</div>
      <BoardContentWrapper>
        <div className="flex space-around photo-desc">
          <div className="queryStr">
            <FontAwesomeIcon icon="fa-image" />
            {"  "}사진
          </div>
          <div className="edit-info">
            <span className="red-dot">*</span>사진은 수정할 수 없습니다.
          </div>
        </div>
        <ContentImgWrapper>
          <ContentEditImg
            src={`https://togetdog.site/image/board/` + boardData.image}
          />
        </ContentImgWrapper>

        <p className="queryStr">
          <FontAwesomeIcon icon="fa-pen" />
          {"  "}내용
        </p>
        <div className="textInputWrapper">
          <textarea
            className="textInput"
            onChange={onChangeContent}
            defaultValue={content}
            ref={contentRef}
          />
        </div>
      </BoardContentWrapper>
      <div className="btnWrapper">
        <MainColorShortBtn
          onClick={() => {
            window.location.replace(`/board/${boardId}`);
          }}>
          취소
        </MainColorShortBtn>
        <MainColorShortBtn onClick={onClickEdit}>수정</MainColorShortBtn>
      </div>
    </CreateBoardWrapper>
  );
};

export default EditBoard;
