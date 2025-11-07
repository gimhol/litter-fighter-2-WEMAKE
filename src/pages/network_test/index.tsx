
import List from "rc-virtual-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../Component/Buttons/Button";
import Combine from "../../Component/Combine";
import { Divider } from "../../Component/Divider";
import { Flex } from "../../Component/Flex";
import Frame from "../../Component/Frame";
import { Input } from "../../Component/Input";
import Show from "../../Component/Show";
import { Space } from "../../Component/Space";
import { Strong, Text } from "../../Component/Text";
import { IRoomInfo, MsgEnum } from "../../Net";
import { ChatBox } from "./ChatBox";
import { Connection } from "./Connection";
import { useRoom } from "./useRoom";
import { TriState } from "./TriState";
import { RoomsBox } from "./RoomsBox";
import styles from "./styles.module.scss"
import { useStateRef } from "@fimagine/dom-hooks/dist/useStateRef";


indexedDB.databases().then((r) => console.log(r))

function Player() {
  const [conn_state, set_connected] = useState<TriState>(TriState.False);
  const [conn, set_conn, ref_conn] = useStateRef<Connection | null>(null)
  const { room } = useRoom(conn)
  const [countdown, set_countdown] = useState(5);
  const [address, set_address] = useStateRef('ws://localhost:8080')
  const [nickname, set_nickname] = useStateRef('')

  const { players, me, owner, all_ready, is_owner } = useMemo(() => {
    const players = room?.players ?? []
    const me = players.find(v => v.id == conn?.player?.id) || null;
    const owner = players.find(v => v.id == room?.owner?.id) || null;
    const all_ready = !!(
      !players.some(v => !v.ready) &&
      room?.min_players &&
      players.length >= room.min_players
    )
    return { players, me, owner, all_ready, is_owner: me === owner } as const
  }, [room])


  useEffect(() => {
    let sec = 5
    set_countdown(sec);
    if (!all_ready) return;
    const tid = setInterval(() => {
      sec -= 1;
      set_countdown(sec);
      if (sec > 0) return;

      clearInterval(tid);
      if (is_owner)
        ref_conn.current?.send(MsgEnum.RoomStart, {})
    }, 1000)
    return () => clearInterval(tid)
  }, [all_ready, is_owner])

  function connect() {
    if (ref_conn.current) return;
    const conn = new Connection(nickname);
    set_conn(conn);
  }

  useEffect(() => {
    if (!conn) return;
    conn.open(`${address}`)
    set_connected(TriState.Pending);
    conn.callbacks.once('on_close', (e) => {
      set_connected(TriState.False)
      set_conn(null)
    })
    conn.callbacks.once('on_register', () => set_connected(TriState.True))
    conn.callbacks.add({
      on_message: (resp) => {
        switch (resp.type) {
          case MsgEnum.RoomStart:
            alert('!')
            break;
        }
      }
    })
    return () => conn?.close()
  }, [conn])


  return <>
    <Space>
      <Flex direction='column' gap={5}>
        {
          conn_state ? null :
            <Combine style={{ alignSelf: 'flex-start' }} direction='column'>
              <Input
                style={{ minWidth: 300, maxWidth: 300 }}
                value={address}
                onChange={set_address}
                disabled={!!conn_state}
                prefix={<Text size='s'>地址:</Text>}
              />
              <Combine>
                <Input
                  value={nickname}
                  onChange={set_nickname}
                  disabled={!!conn_state}
                  data-flex={1}
                  prefix={<Text size='s'>昵称:</Text>}
                />
                <Button
                  disabled={conn_state === TriState.Pending || !address.trim()}
                  onClick={connect}>
                  {{
                    [TriState.False]: 'connect',
                    [TriState.Pending]: 'connecting...',
                    [TriState.True]: 'disconnect',
                  }[conn_state]}
                </Button>
              </Combine>
            </Combine>
        }
      </Flex>
      <Show show={conn_state === TriState.True}>
        <Show show={room}>
          <Frame style={{ padding: 0 }}>
            <Flex direction='column' align='stretch' gap={5}>
              <Flex gap={10} align='center' justify='space-between' style={{ margin: 5 }}>
                <Strong>{`${room?.title} (${players?.length}/${room?.max_players})`}</Strong>
              </Flex>
              <Divider />
            </Flex>
            <List data={players} itemKey={r => r.id!} styles={{ verticalScrollBarThumb: { backgroundColor: 'rgba(255,255,255,0.3)' } }}>
              {(other, index) => {
                const is_self = other.id === conn?.player?.id
                return (
                  <Flex direction='column' align='stretch' gap={5}>
                    <Flex gap={10} align='center' justify='space-between' style={{ margin: 5 }}>
                      <Text >
                        {other.name}
                      </Text>
                      <Text style={{ opacity: 0.5, verticalAlign: 'middle' }}>
                        {is_self ? '(你)' : ''}
                        {other.id == room?.owner?.id ? '👑' : ''}
                      </Text>
                      <Flex align='center'>
                        <Show show={owner?.id === me?.id && !is_self}>
                          <Button
                            variants={['no_border', 'no_round', 'no_shadow']}
                            onClick={() => ref_conn.current?.send(MsgEnum.Kick, { playerid: other.id })}>
                            踢出
                          </Button>
                        </Show>
                        <Text> {other.ready ? '已准备' : '未准备'} </Text>
                      </Flex>
                    </Flex>
                    <Divider />
                  </Flex>
                )
              }}
            </List>
            {
              all_ready ?
                <Flex direction='row' align='stretch' justify='space-evenly' gap={5} style={{ margin: 5 }}>
                  即将开始，倒计时: {countdown}秒
                </Flex> : null
            }
            <Flex direction='row' align='stretch' justify='space-evenly' gap={5} style={{ margin: 5 }}>
              <Button
                variants={['no_border', 'no_round', 'no_shadow']}
                onClick={() => ref_conn.current?.send(MsgEnum.ExitRoom, {})}>
                <Text> 退出房间 </Text>
              </Button>
              <Button
                variants={['no_border', 'no_round', 'no_shadow']}
                onClick={() => ref_conn.current?.send(MsgEnum.PlayerReady, { ready: !me?.ready })}>
                {me?.ready ? '取消准备' : '准备!'}
              </Button>
            </Flex>
          </Frame>
        </Show>
      </Show>
    </Space>

    <ChatBox
      conn={conn}
      className={styles.chat_box}
      style={{
        opacity: conn_state ? 1 : 0,
        pointerEvents: conn_state ? void 0 : 'none',
      }}
    />
    <RoomsBox
      conn={conn}
      conn_state={conn_state}
      style={{
        opacity: conn_state ? 1 : 0,
        pointerEvents: conn_state ? void 0 : 'none',
      }} />
  </>
}

export default function NetworkTest() {
  return (
    <Space vertical>
      <Player />
    </Space>
  )
}