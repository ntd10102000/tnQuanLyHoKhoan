PGDMP         7        
        {            sputnik    14.2    14.2 C    F           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            G           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            H           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            I           1262    98339    sputnik    DATABASE     k   CREATE DATABASE sputnik WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE sputnik;
                postgres    false            �            1259    98361    danhgia    TABLE     $  CREATE TABLE public.danhgia (
    iddanhgia bigint NOT NULL,
    idsanpham bigint,
    idnguoidung bigint,
    noidung text,
    thoigian character varying,
    sosaochatluong numeric,
    sosaogia numeric,
    sosaogiatri numeric,
    sosaotrungbinh numeric,
    status integer DEFAULT 1
);
    DROP TABLE public.danhgia;
       public         heap    postgres    false            �            1259    98360    danhgia_iddanhgia_seq    SEQUENCE     ~   CREATE SEQUENCE public.danhgia_iddanhgia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.danhgia_iddanhgia_seq;
       public          postgres    false    214            J           0    0    danhgia_iddanhgia_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.danhgia_iddanhgia_seq OWNED BY public.danhgia.iddanhgia;
          public          postgres    false    213            �            1259    98413    diendan    TABLE     �   CREATE TABLE public.diendan (
    iddiendan bigint NOT NULL,
    iddanhmuc bigint,
    tieude text,
    noidung text,
    thoigian character varying,
    parentid bigint,
    idnguoidung bigint,
    status integer DEFAULT 1
);
    DROP TABLE public.diendan;
       public         heap    postgres    false            �            1259    98412    diendan_iddiendan_seq    SEQUENCE     ~   CREATE SEQUENCE public.diendan_iddiendan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.diendan_iddiendan_seq;
       public          postgres    false    226            K           0    0    diendan_iddiendan_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.diendan_iddiendan_seq OWNED BY public.diendan.iddiendan;
          public          postgres    false    225            �            1259    98379    donhang    TABLE     �   CREATE TABLE public.donhang (
    iddonhang bigint NOT NULL,
    idnguoidung bigint,
    giasanpham bigint,
    giaship bigint,
    thoigian character varying,
    idmagiamgia bigint,
    giacanthanhtoan bigint,
    status integer DEFAULT 1
);
    DROP TABLE public.donhang;
       public         heap    postgres    false            �            1259    98378    donhang_iddonhang_seq    SEQUENCE     ~   CREATE SEQUENCE public.donhang_iddonhang_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.donhang_iddonhang_seq;
       public          postgres    false    218            L           0    0    donhang_iddonhang_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.donhang_iddonhang_seq OWNED BY public.donhang.iddonhang;
          public          postgres    false    217            �            1259    98371    giohang    TABLE     �   CREATE TABLE public.giohang (
    idgiohang bigint NOT NULL,
    idnguoidung bigint,
    idsanpham bigint,
    soluong bigint,
    status integer DEFAULT 1
);
    DROP TABLE public.giohang;
       public         heap    postgres    false            �            1259    98370    giohang_idgiohang_seq    SEQUENCE     ~   CREATE SEQUENCE public.giohang_idgiohang_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.giohang_idgiohang_seq;
       public          postgres    false    216            M           0    0    giohang_idgiohang_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.giohang_idgiohang_seq OWNED BY public.giohang.idgiohang;
          public          postgres    false    215            �            1259    98404 	   magiamgia    TABLE     ,  CREATE TABLE public.magiamgia (
    idmagiangia bigint NOT NULL,
    tenchuongtrinh character varying,
    magiamgia character varying,
    thoihan character varying,
    kieu character varying,
    soluongcan bigint,
    mota character varying,
    status integer DEFAULT 1,
    iddanhmuc bigint
);
    DROP TABLE public.magiamgia;
       public         heap    postgres    false            �            1259    98403    magiamgia_idmagiangia_seq    SEQUENCE     �   CREATE SEQUENCE public.magiamgia_idmagiangia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.magiamgia_idmagiangia_seq;
       public          postgres    false    224            N           0    0    magiamgia_idmagiangia_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.magiamgia_idmagiangia_seq OWNED BY public.magiamgia.idmagiangia;
          public          postgres    false    223            �            1259    98341    sanpham    TABLE     A  CREATE TABLE public.sanpham (
    idsanpham bigint NOT NULL,
    masanpham character varying,
    soluong bigint,
    tensanpham character varying,
    sosaotrungbinh numeric,
    motangan text,
    mota text,
    anhdaidien text,
    iddanhmuc bigint,
    status integer DEFAULT 1,
    gia bigint,
    giamgia bigint
);
    DROP TABLE public.sanpham;
       public         heap    postgres    false            �            1259    98340    sanpham_idsanpham_seq    SEQUENCE     ~   CREATE SEQUENCE public.sanpham_idsanpham_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.sanpham_idsanpham_seq;
       public          postgres    false    210            O           0    0    sanpham_idsanpham_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.sanpham_idsanpham_seq OWNED BY public.sanpham.idsanpham;
          public          postgres    false    209            �            1259    98389    sanphamdonhang    TABLE     �   CREATE TABLE public.sanphamdonhang (
    idsanphamdonhang bigint NOT NULL,
    idsanpham bigint,
    iddonhang bigint,
    status integer DEFAULT 1,
    soluong bigint
);
 "   DROP TABLE public.sanphamdonhang;
       public         heap    postgres    false            �            1259    98388 #   sanphamdonhang_idsanphamdonhang_seq    SEQUENCE     �   CREATE SEQUENCE public.sanphamdonhang_idsanphamdonhang_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.sanphamdonhang_idsanphamdonhang_seq;
       public          postgres    false    220            P           0    0 #   sanphamdonhang_idsanphamdonhang_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.sanphamdonhang_idsanphamdonhang_seq OWNED BY public.sanphamdonhang.idsanphamdonhang;
          public          postgres    false    219            �            1259    98351    sanphamhinhanh    TABLE     �   CREATE TABLE public.sanphamhinhanh (
    idsanphamhinhanh bigint NOT NULL,
    idsanpham bigint,
    uri text,
    motaanh text,
    status integer DEFAULT 1
);
 "   DROP TABLE public.sanphamhinhanh;
       public         heap    postgres    false            �            1259    98350 #   sanphamhinhanh_idsanphamhinhanh_seq    SEQUENCE     �   CREATE SEQUENCE public.sanphamhinhanh_idsanphamhinhanh_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.sanphamhinhanh_idsanphamhinhanh_seq;
       public          postgres    false    212            Q           0    0 #   sanphamhinhanh_idsanphamhinhanh_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.sanphamhinhanh_idsanphamhinhanh_seq OWNED BY public.sanphamhinhanh.idsanphamhinhanh;
          public          postgres    false    211            �            1259    98397    sanphamyeuthich    TABLE     }   CREATE TABLE public.sanphamyeuthich (
    idsanphamyeuthich bigint NOT NULL,
    idnguoidung bigint,
    idsanpham bigint
);
 #   DROP TABLE public.sanphamyeuthich;
       public         heap    postgres    false            �            1259    98396 %   sanphamyeuthich_idsanphamyeuthich_seq    SEQUENCE     �   CREATE SEQUENCE public.sanphamyeuthich_idsanphamyeuthich_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.sanphamyeuthich_idsanphamyeuthich_seq;
       public          postgres    false    222            R           0    0 %   sanphamyeuthich_idsanphamyeuthich_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.sanphamyeuthich_idsanphamyeuthich_seq OWNED BY public.sanphamyeuthich.idsanphamyeuthich;
          public          postgres    false    221            �           2604    98364    danhgia iddanhgia    DEFAULT     v   ALTER TABLE ONLY public.danhgia ALTER COLUMN iddanhgia SET DEFAULT nextval('public.danhgia_iddanhgia_seq'::regclass);
 @   ALTER TABLE public.danhgia ALTER COLUMN iddanhgia DROP DEFAULT;
       public          postgres    false    214    213    214            �           2604    98416    diendan iddiendan    DEFAULT     v   ALTER TABLE ONLY public.diendan ALTER COLUMN iddiendan SET DEFAULT nextval('public.diendan_iddiendan_seq'::regclass);
 @   ALTER TABLE public.diendan ALTER COLUMN iddiendan DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    98382    donhang iddonhang    DEFAULT     v   ALTER TABLE ONLY public.donhang ALTER COLUMN iddonhang SET DEFAULT nextval('public.donhang_iddonhang_seq'::regclass);
 @   ALTER TABLE public.donhang ALTER COLUMN iddonhang DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    98374    giohang idgiohang    DEFAULT     v   ALTER TABLE ONLY public.giohang ALTER COLUMN idgiohang SET DEFAULT nextval('public.giohang_idgiohang_seq'::regclass);
 @   ALTER TABLE public.giohang ALTER COLUMN idgiohang DROP DEFAULT;
       public          postgres    false    215    216    216            �           2604    98407    magiamgia idmagiangia    DEFAULT     ~   ALTER TABLE ONLY public.magiamgia ALTER COLUMN idmagiangia SET DEFAULT nextval('public.magiamgia_idmagiangia_seq'::regclass);
 D   ALTER TABLE public.magiamgia ALTER COLUMN idmagiangia DROP DEFAULT;
       public          postgres    false    223    224    224            �           2604    98344    sanpham idsanpham    DEFAULT     v   ALTER TABLE ONLY public.sanpham ALTER COLUMN idsanpham SET DEFAULT nextval('public.sanpham_idsanpham_seq'::regclass);
 @   ALTER TABLE public.sanpham ALTER COLUMN idsanpham DROP DEFAULT;
       public          postgres    false    210    209    210            �           2604    98392    sanphamdonhang idsanphamdonhang    DEFAULT     �   ALTER TABLE ONLY public.sanphamdonhang ALTER COLUMN idsanphamdonhang SET DEFAULT nextval('public.sanphamdonhang_idsanphamdonhang_seq'::regclass);
 N   ALTER TABLE public.sanphamdonhang ALTER COLUMN idsanphamdonhang DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    98354    sanphamhinhanh idsanphamhinhanh    DEFAULT     �   ALTER TABLE ONLY public.sanphamhinhanh ALTER COLUMN idsanphamhinhanh SET DEFAULT nextval('public.sanphamhinhanh_idsanphamhinhanh_seq'::regclass);
 N   ALTER TABLE public.sanphamhinhanh ALTER COLUMN idsanphamhinhanh DROP DEFAULT;
       public          postgres    false    211    212    212            �           2604    98400 !   sanphamyeuthich idsanphamyeuthich    DEFAULT     �   ALTER TABLE ONLY public.sanphamyeuthich ALTER COLUMN idsanphamyeuthich SET DEFAULT nextval('public.sanphamyeuthich_idsanphamyeuthich_seq'::regclass);
 P   ALTER TABLE public.sanphamyeuthich ALTER COLUMN idsanphamyeuthich DROP DEFAULT;
       public          postgres    false    221    222    222            7          0    98361    danhgia 
   TABLE DATA           �   COPY public.danhgia (iddanhgia, idsanpham, idnguoidung, noidung, thoigian, sosaochatluong, sosaogia, sosaogiatri, sosaotrungbinh, status) FROM stdin;
    public          postgres    false    214    O       C          0    98413    diendan 
   TABLE DATA           q   COPY public.diendan (iddiendan, iddanhmuc, tieude, noidung, thoigian, parentid, idnguoidung, status) FROM stdin;
    public          postgres    false    226   O       ;          0    98379    donhang 
   TABLE DATA           ~   COPY public.donhang (iddonhang, idnguoidung, giasanpham, giaship, thoigian, idmagiamgia, giacanthanhtoan, status) FROM stdin;
    public          postgres    false    218   :O       9          0    98371    giohang 
   TABLE DATA           U   COPY public.giohang (idgiohang, idnguoidung, idsanpham, soluong, status) FROM stdin;
    public          postgres    false    216   WO       A          0    98404 	   magiamgia 
   TABLE DATA              COPY public.magiamgia (idmagiangia, tenchuongtrinh, magiamgia, thoihan, kieu, soluongcan, mota, status, iddanhmuc) FROM stdin;
    public          postgres    false    224   tO       3          0    98341    sanpham 
   TABLE DATA           �   COPY public.sanpham (idsanpham, masanpham, soluong, tensanpham, sosaotrungbinh, motangan, mota, anhdaidien, iddanhmuc, status, gia, giamgia) FROM stdin;
    public          postgres    false    210   �O       =          0    98389    sanphamdonhang 
   TABLE DATA           a   COPY public.sanphamdonhang (idsanphamdonhang, idsanpham, iddonhang, status, soluong) FROM stdin;
    public          postgres    false    220   �O       5          0    98351    sanphamhinhanh 
   TABLE DATA           [   COPY public.sanphamhinhanh (idsanphamhinhanh, idsanpham, uri, motaanh, status) FROM stdin;
    public          postgres    false    212   �O       ?          0    98397    sanphamyeuthich 
   TABLE DATA           T   COPY public.sanphamyeuthich (idsanphamyeuthich, idnguoidung, idsanpham) FROM stdin;
    public          postgres    false    222   �O       S           0    0    danhgia_iddanhgia_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.danhgia_iddanhgia_seq', 1, false);
          public          postgres    false    213            T           0    0    diendan_iddiendan_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.diendan_iddiendan_seq', 1, false);
          public          postgres    false    225            U           0    0    donhang_iddonhang_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.donhang_iddonhang_seq', 1, false);
          public          postgres    false    217            V           0    0    giohang_idgiohang_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.giohang_idgiohang_seq', 1, false);
          public          postgres    false    215            W           0    0    magiamgia_idmagiangia_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.magiamgia_idmagiangia_seq', 1, false);
          public          postgres    false    223            X           0    0    sanpham_idsanpham_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.sanpham_idsanpham_seq', 1, false);
          public          postgres    false    209            Y           0    0 #   sanphamdonhang_idsanphamdonhang_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.sanphamdonhang_idsanphamdonhang_seq', 1, false);
          public          postgres    false    219            Z           0    0 #   sanphamhinhanh_idsanphamhinhanh_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.sanphamhinhanh_idsanphamhinhanh_seq', 1, false);
          public          postgres    false    211            [           0    0 %   sanphamyeuthich_idsanphamyeuthich_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.sanphamyeuthich_idsanphamyeuthich_seq', 1, false);
          public          postgres    false    221            �           2606    98369    danhgia danhgia_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_pkey PRIMARY KEY (iddanhgia);
 >   ALTER TABLE ONLY public.danhgia DROP CONSTRAINT danhgia_pkey;
       public            postgres    false    214            �           2606    98421    diendan diendan_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.diendan
    ADD CONSTRAINT diendan_pkey PRIMARY KEY (iddiendan);
 >   ALTER TABLE ONLY public.diendan DROP CONSTRAINT diendan_pkey;
       public            postgres    false    226            �           2606    98387    donhang donhang_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_pkey PRIMARY KEY (iddonhang);
 >   ALTER TABLE ONLY public.donhang DROP CONSTRAINT donhang_pkey;
       public            postgres    false    218            �           2606    98377    giohang giohang_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_pkey PRIMARY KEY (idgiohang);
 >   ALTER TABLE ONLY public.giohang DROP CONSTRAINT giohang_pkey;
       public            postgres    false    216            �           2606    98411    magiamgia magiamgia_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.magiamgia
    ADD CONSTRAINT magiamgia_pkey PRIMARY KEY (idmagiangia);
 B   ALTER TABLE ONLY public.magiamgia DROP CONSTRAINT magiamgia_pkey;
       public            postgres    false    224            �           2606    98349    sanpham sanpham_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_pkey PRIMARY KEY (idsanpham);
 >   ALTER TABLE ONLY public.sanpham DROP CONSTRAINT sanpham_pkey;
       public            postgres    false    210            �           2606    98395 "   sanphamdonhang sanphamdonhang_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.sanphamdonhang
    ADD CONSTRAINT sanphamdonhang_pkey PRIMARY KEY (idsanphamdonhang);
 L   ALTER TABLE ONLY public.sanphamdonhang DROP CONSTRAINT sanphamdonhang_pkey;
       public            postgres    false    220            �           2606    98359 "   sanphamhinhanh sanphamhinhanh_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.sanphamhinhanh
    ADD CONSTRAINT sanphamhinhanh_pkey PRIMARY KEY (idsanphamhinhanh);
 L   ALTER TABLE ONLY public.sanphamhinhanh DROP CONSTRAINT sanphamhinhanh_pkey;
       public            postgres    false    212            �           2606    98402 $   sanphamyeuthich sanphamyeuthich_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.sanphamyeuthich
    ADD CONSTRAINT sanphamyeuthich_pkey PRIMARY KEY (idsanphamyeuthich);
 N   ALTER TABLE ONLY public.sanphamyeuthich DROP CONSTRAINT sanphamyeuthich_pkey;
       public            postgres    false    222            7      x������ � �      C      x������ � �      ;      x������ � �      9      x������ � �      A      x������ � �      3      x������ � �      =      x������ � �      5      x������ � �      ?      x������ � �     