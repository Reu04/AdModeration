import { Oval } from 'react-loader-spinner'

export default function MyLoader() {
    return (
        <div className="loader-container">
            <Oval
                visible={true}
                height={80}
                width={80}
                color="#00acff"
                secondaryColor="#00acff"
                strokeWidth={4}
                strokeWidthSecondary={4}
                ariaLabel="oval-loading"
            />
        </div>
    )
}
