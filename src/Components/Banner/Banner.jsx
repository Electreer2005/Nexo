import bannerImg from '../../assets/Banner.png';

export default function Banner() {
    return (
        <>
            <section className="hero">
                <div className="hero__bg"><img src={bannerImg} alt="" /></div>
                <div className="hero__content">
                    <span className="hero__badge">
                        <span className="hero__badge-dot"></span> Nuevo álbum disponible
                    </span>
                    <h1 className="hero__title">Patagonia Salvaje</h1>
                    <p className="hero__subtitle">Un viaje visual por glaciares, montañas y cielos infinitos.</p>
                    <div className="hero__cta-group">
                        <button className="btn btn--primary shine">Explorar álbum</button>
                        <button className="btn btn--ghost">Ver trailer</button>
                    </div>
                </div>
            </section>
        </>
    )
}
