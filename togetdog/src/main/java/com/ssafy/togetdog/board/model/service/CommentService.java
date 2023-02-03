package com.ssafy.togetdog.board.model.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.togetdog.board.model.dto.BoardDto;
import com.ssafy.togetdog.board.model.dto.CommentDto;
import com.ssafy.togetdog.board.model.entity.Comment;
import com.ssafy.togetdog.board.model.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
//	private final BoardService boardService;
	
	public List<CommentDto> findAllCommentsInBoard(long boardId){
		BoardDto boardDto = new BoardDto();
		boardDto.setBoardId(boardId);
		boardDto.setImage("");
		List<Comment> comments = commentRepository.findAllByBoard(boardDto.toEntity()).orElse(null);

		//stream 써서 코드 발전 시킬 수 있음
		List<CommentDto> cmts = new ArrayList<CommentDto>();
		for (Comment comment : comments) {
			CommentDto commentDto = new CommentDto(comment.getCommentId(), comment.getBoard().getBoardId(), comment.getUser().getUserId(), comment.getCommentContent());
			cmts.add(commentDto);
		}
        return cmts; 
	}
	
	public Long save(final CommentDto commentDto) {
		Comment comment = commentRepository.save(commentDto.toEntity());
		return comment.getCommentId();
	}

	public void delete(long commentId) {
		commentRepository.deleteById(commentId);
	}
}
