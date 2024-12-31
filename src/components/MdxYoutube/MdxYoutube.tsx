import { FC } from "react";

import style from './style.module.css'

interface MdxYoutubeProps {
    src: string;
    title: string;
}

const MdxYoutube: FC<MdxYoutubeProps> = ({ src, title }) => {
    return <div className={style.wrapper}>
        <iframe className={style.iframe} src={src} title={title} allowFullScreen />
    </div>
}

export { MdxYoutube };