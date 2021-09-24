package com.sparta.blog.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.Column;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {
    private Long id;        //글번호
    private String title;   //제목
    private String name;    //작성자명
    private String content; //내용
}
