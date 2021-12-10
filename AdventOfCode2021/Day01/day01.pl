:- use_module(library(clpfd)).
:- use_module(library(dcg/basics), [integer/3]).

solve() :-
   part1('sample.txt', Sample1),
   write(Sample1),
   write('\n'),
   part1('personal.txt', Personal1),
   write(Personal1),
   write('\n'),
   part2('sample.txt', Sample2),
   write(Sample2),
   write('\n'),
   part2('personal.txt', Personal2),
   write(Personal2),
   write('\n').


read_lines(Stream, []) :- at_end_of_stream(Stream).
read_lines(Stream, [X | L]) :-
   \+ at_end_of_stream(Stream),
   read_line_to_string(Stream, X),
   read_lines(Stream, L).

parse_all(File, Numbers) :-
   read_lines(File, Lines),
   maplist(parse, Lines, Numbers).

parse(String, Value) :-
   atom_number(String, Value).



part1(File, Answer) :-
   open(File, read, Stream),
   parse_all(Stream, Numbers),
   increase_count(Numbers, Answer).

increase(X, Y, 0):-
   X #= Y.
increase(X, Y, 0) :-
   X #> Y.
increase(X, Y, 1) :-
   X #< Y.

increase_count([], 0).
increase_count([_], 0).
increase_count([X, Y], N):- increase(X, Y, N).
increase_count([X|[Y|Rest]], N):-
   increase(X, Y, N0),
   increase_count([Y|Rest], N1),
   N #= N0 + N1.



part2(File, Answer) :-
   open(File, read, Stream),
   parse_all(Stream, Numbers),
   sum3(Numbers, Sum),
   increase_count(Sum, Answer).

sum3([_,_], []).
sum3([X|[Y|[Z|Rest]]], [X+Y+Z|S]):-
   sum3([Y|[Z|Rest]], S).
