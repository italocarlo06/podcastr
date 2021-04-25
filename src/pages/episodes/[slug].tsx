import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import api from '../../services/api';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';

import styles from './episode.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Head from 'next/head';

type Episode = {  
  id: string;
  title: string;
  members: string;  
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;

}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps){ 
  const { play }  = useContext(PlayerContext);
  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
                <img src="/arrow-left.svg" alt="Voltar"></img>
            </button>
            </Link>
          <Image
            src={episode.thumbnail} 
            width={700}
            height={160}
            objectFit="cover"
          />
          <button type="button" onClick={() => play(episode)}>
              <img src="/play.svg" alt="Tocar Episódio"></img>
          </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div 
        className={styles.description} 
        dangerouslySetInnerHTML={{ __html: episode.description}} 
      />         
     
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const response= await api.get('episodes',{
    params: {
      _limit:2,
      _sort:'published_at',
      _order:'desc'
    }
  });

  const { data } = response;  

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })
  return {
    paths,
    fallback: 'blocking'    
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug  } =  ctx.params;  
  const { data } = await api.get(`/episodes/${slug}`);
  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    publishedAt: format(parseISO(data.published_at),'d MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,

  }
  return {
    props: {
      episode
    },
    revalidate: 60*60*24  //24 hours
  }
}

